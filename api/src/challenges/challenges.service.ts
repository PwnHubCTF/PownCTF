import { HttpService } from '@nestjs/axios';
import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/auth/role.enum';
import { ConfigsService } from 'src/configs/configs.service';
import { FilesService } from 'src/files/files.service';
import { SubmissionsService } from 'src/submissions/submissions.service';
import { TeamsService } from 'src/teams/teams.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Challenge } from './entities/challenge.entity';
import scan from './git-scanner'
@Injectable()
export class ChallengesService {
  constructor(
    @InjectRepository(Challenge) protected readonly repository: Repository<Challenge>,
    @Inject(forwardRef(() => SubmissionsService)) protected readonly submissionsService: SubmissionsService,
    protected readonly teamsService: TeamsService,
    protected readonly configsService: ConfigsService,
    private readonly filesService: FilesService,
    private readonly usersService: UsersService,
  ) { }

  /**
   * Get a challenge
   * @returns Challenge
   * @warning Result can be outdated since we're using a cache
   */
  async findOne (id: string) {
    let challenge = await this.repository.findOne({ where: { id }, cache: 5000, relations: ['files'] })
    if (!challenge) throw new NotFoundException('Challenge not found')
    return challenge
  }

  async remove (id: string) {
    const challenge = await this.findOne(id)
    if (challenge.files) await this.filesService.deleteFiles(challenge.files)
    return await challenge.remove()
  }

  async addDependencie (challengeId: string, dependedId: string) {
    const c = await this.repository.findOne({ where: { id: challengeId }, relations: ['depends_on'] })
    const d = await this.repository.findOne({ where: { id: dependedId }, relations: ['depends_on'] })

    c.depends_on.push(d)
    return await c.save()
  }

  async fetchFromGit () {
    let url = await this.configsService.getValueFromKey('github.repo_url')
    let token = await this.configsService.getValueFromKey('github.access_token')
    if (!url || !token) throw new ForbiddenException('Github informations are missing')

    const imported = []

    try {
      const remoteChallenges = (await scan(url, token)).sort((a, b) => a.depends_on.length - b.depends_on.length)
      const max_points = await this.configsService.getNumberFromKey('challenge.max_points')

      for (const remoteChallenge of remoteChallenges) {
        if (remoteChallenge.status == 'error') {
          imported.push(remoteChallenge)
        } else {
          const old = await this.repository.findOneBy({ name: remoteChallenge.data.name, source: 'github' })
          if (!old) {
            let valid = true
            for (const dependedId of remoteChallenge.depends_on) {
              let depended = await this.repository.findOne({ where: { id: dependedId } })
              if (!depended) {
                valid = false
                imported.push({
                  status: 'error',
                  reason: `Dependency '${dependedId}' for challenge ${remoteChallenge.data.id} is not found. You can probably retry import`
                })
              }
            }
            if (valid) {
              const challenge = await this.repository.save({ ...remoteChallenge.data, points: max_points })

              challenge.files = []
              for (const path of remoteChallenge.files) {
                const file = await this.filesService.addFileFromPath(path)
                file.challenge = remoteChallenge.data.id
              }

              for (const dependedId of remoteChallenge.depends_on) {
                await this.addDependencie(challenge.id, dependedId)
              }

              imported.push({
                status: 'new',
                challenge: challenge.name
              })
            }

          } else {
            imported.push({
              status: 'exists',
              challenge: old.name
            })
          }
        }
      }
      return imported
    } catch (error) {
      throw new ForbiddenException(error.message)
    }

  }

  async all () {
    return await this.repository.find({ order: { source: 'ASC' }, relations: ['files', 'depends_on'] })
  }

  async updateChallengePoints (challenge: Challenge) {
    let valids = await this.submissionsService.findValidsForChallenge(challenge.id)
    let max = await this.configsService.getNumberFromKey('challenge.max_points')
    let min = await this.configsService.getNumberFromKey('challenge.min_points')
    let decay = await this.configsService.getNumberFromKey('challenge.decay')

    let points = Math.round(
      ((min - max) / Math.pow(decay, 1.5)) * Math.pow(valids.length, 1.5) + max
    );
    challenge.points = (points > min ? points : min) > max ? max : (points > min ? points : min)
    challenge.solves = valids.length
    await challenge.save()
  }

  async updateChallengesPoints(){
    const challenges = await this.repository.find()
    for (const challenge of challenges) {
      await this.updateChallengePoints(challenge)
    }
    await this.usersService.updatePlayersPoints()
    return true
  }

  async getCategories () {
    const categories = await this.repository.find({
      select: ['category'],
      order: { category: 'ASC' },
      cache: 60000
    })

    return categories.filter((v, i, a) => a.findIndex(v2 => (v2.category === v.category)) === i).map(e => e.category)
  }

  async signFlagFromChallengeAndUser(challengeId: string, userId: string) {
    const challenge = await this.findOne(challengeId)

    let flag = challenge.flag
    let secret = process.env.SIGNED_FLAG_SECRET || 'NOSECRETSET'
    let hash = require('crypto').createHash('sha256').update(`${flag}${userId}${secret}`, 'utf8').digest('hex')
    return `${flag.slice(0, -1)}_${hash.slice(0,2)}}`
  }

  // For /challenges page
  async findForUser (user: User) {
    // const challenges = await this.repository.query("SELECT solves, author, category, challengeUrl, description, difficulty, id, instance, name, points FROM `challenge` ORDER BY category ASC")
    let challenges = await this.repository.find({
      select: ['solves', 'author', 'category', 'challengeUrl', 'description', 'difficulty', 'id', 'instance', 'name', 'points',],
      order: { category: 'ASC' },
      relations: ['files', 'depends_on'],
    })
    for (const challenge of challenges) {
      // Delete infos on files
      challenge.files.map(f => {
        delete f.path
        delete f.creation
        return f
      })

      challenge.depends_on = challenge.depends_on.map(c => {
        return { id: c.id, name: c.name }
      }) as any

      challenge.solved = await this.checkIfSolved(user, challenge)
    }

    for (const challenge of challenges) {
      challenge.locked = false
      for (const depended of challenge.depends_on) {
        let d = challenges.find(c => c.id == depended.id)
        if (!d.solved) {
          challenge.locked = true
          continue
        }
      }
    }

    // Remove challenge if they're not unlocked
    challenges = challenges.filter(c => !c.locked)

    // Regroup by categories
    let sortedByCategories = {}
    for (const challenge of challenges) {
      if (!sortedByCategories[challenge.category]) sortedByCategories[challenge.category] = []
      sortedByCategories[challenge.category].push(challenge)
    }
    return sortedByCategories
  }

  /**
   * Verify if a user or his team has solve a challenge
   * @param user
   * @param challenge
   * @returns date of solve or false
   */
  async checkIfSolved (user: User, challenge: Challenge) {
    const isTeamMode = await this.configsService.getBooleanFromKey('ctf.team_mode')
    if (isTeamMode) {
      let team = await this.teamsService.findOneReduced(user.team.id)
      for (const teammate of team.users) {
        const valid = await this.submissionsService.checkIfChallengeIsValidateByUser(teammate, challenge)
        if (valid) return valid
      }
    } else {
      const valid = await this.submissionsService.checkIfChallengeIsValidateByUser(user, challenge)
      if (valid) return valid
    }

    return false
  }


}

