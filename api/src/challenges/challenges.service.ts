import { HttpService } from '@nestjs/axios';
import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/auth/role.enum';
import { ConfigsService } from 'src/configs/configs.service';
import { FilesService } from 'src/files/files.service';
import { SubmissionsService } from 'src/submissions/submissions.service';
import { TeamsService } from 'src/teams/teams.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { DeployerService } from './deployer.service';
import { Challenge } from './entities/challenge.entity';
import scan from './git-scanner'
@Injectable()
export class ChallengesService {
  constructor(
    @InjectRepository(Challenge) protected readonly repository: Repository<Challenge>,
    @Inject(forwardRef(() => SubmissionsService)) protected readonly submissionsService: SubmissionsService,
    protected readonly teamsService: TeamsService,
    protected readonly configsService: ConfigsService,
    private readonly deployerService: DeployerService,
    private readonly filesService: FilesService
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
      const max_points = parseInt(await this.configsService.getValueFromKey('challenge.max_points'))

      for (const remoteChallenge of remoteChallenges) {
        if (remoteChallenge.status == 'error') {
          imported.push(remoteChallenge)
        } else {
          const old = await this.repository.findOneBy({ name: remoteChallenge.data.name, source: 'github' })
          if (!old) {
            let valid = true
            for (const dependedId of remoteChallenge.depends_on) {
              let depended = await this.repository.findOne({ where: { id: dependedId }})
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
    let max = parseInt(await this.configsService.getValueFromKey('challenge.max_points'))
    let min = parseInt(await this.configsService.getValueFromKey('challenge.min_points'))
    let decay = parseInt(await this.configsService.getValueFromKey('challenge.decay'))

    let points = Math.round(
      ((min - max) / Math.log(decay)) * Math.log(valids.length) + max
    );
    challenge.points = (points > max ? max : points) > min ? points : min;
    challenge.solves = valids.length
    await challenge.save()
  }

  async getCategories () {
    const categories = await this.repository.find({
      select: ['category'],
      order: { category: 'ASC' },
      cache: 60000
    })

    return categories.filter((v, i, a) => a.findIndex(v2 => (v2.category === v.category)) === i).map(e => e.category)
  }

  async deploy (challengeId: string, user: User) {
    const challenge = await this.findOne(challengeId)
    if (!challenge.githubUrl) throw new ForbiddenException('githubUrl information is missing')
    if (challenge.instance == 'multiple') {
      const isTeamMode = await this.configsService.getValueFromKey('ctf.team_mode')
      if (isTeamMode === 'true') return this.deployerService.deploy(challenge.id, challenge.githubUrl, user.team.id)
      return this.deployerService.deploy(challenge.id, challenge.githubUrl, user.id)

    }
    if (challenge.instance == 'single') {
      if (user.role == Role.User) throw new ForbiddenException('You can\'t deploy this challenge')
      return this.deployerService.deploySingle(challenge.id, challenge.githubUrl)
    }
    if (!challenge) throw new ForbiddenException('This challenge is not an instance')

  }

  async stop (id: string, user: User) {
    const instance = await this.getInstanceStatus(id, user)
    const challenge = await this.findOne(id)
    if (challenge.instance == 'multiple') {
      return this.deployerService.stop(instance.id)
    }
    if (challenge.instance == 'single') {
      if (user.role == Role.User) throw new ForbiddenException('You can\'t stop this challenge')
      return this.deployerService.stopSingle(instance.id)
    }
    if (!challenge) throw new ForbiddenException('This challenge is not an instance')

  }

  async getInstanceStatus (id: string, user: User) {
    const challenge = await this.findOne(id)
    if (challenge.instance == 'multiple') {
      const isTeamMode = await this.configsService.getValueFromKey('ctf.team_mode')
      if (isTeamMode) return this.deployerService.getStatus(challenge.id, user.id)
      return this.deployerService.getStatus(challenge.id, user.team.id)
    }
    if (challenge.instance == 'single') {
      if (user.role == Role.User) throw new ForbiddenException('You can\'t view this instance')
      const instance = await this.deployerService.getStatusSingle(challenge.id)

      if (instance.url)
        challenge.challengeUrl = instance.url
      else
        challenge.challengeUrl = null

      challenge.save()
      return instance
    }
    if (!challenge) throw new ForbiddenException('This challenge is not an instance')
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
        return {id: c.id, name: c.name}
      }) as any

      challenge.solved = await this.checkIfSolved(user, challenge)
    }

    for (const challenge of challenges) {
      challenge.locked = false
      for (const depended of challenge.depends_on) {
        let d = challenges.find(c => c.id == depended.id)
        if(!d.solved){
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
    const isTeamMode = await this.configsService.getValueFromKey('ctf.team_mode')
    if (isTeamMode === 'true') {
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

