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
import { ChallengeCache } from './entities/challenge-cache.entity';
import { Challenge } from './entities/challenge.entity';
import scan from './git-scanner'
@Injectable()
export class ChallengesService {
  

  constructor(
    @InjectRepository(Challenge) protected readonly repository: Repository<Challenge>,
    @InjectRepository(ChallengeCache) protected readonly challengeCacheRepository: Repository<ChallengeCache>,
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
    let challenge = await this.repository.findOne({ where: { id }, cache: 5000 })
    if (!challenge) throw new NotFoundException('Challenge not found')
    return challenge
  }

  async fetchFromGit () {
    let url = await this.configsService.getValueFromKey('github.repo_url')
    let token = await this.configsService.getValueFromKey('github.access_token')
    if (!url || !token) throw new ForbiddenException('Github informations are missing')

    try {
      const remoteChallenges = await scan(url, token)
      for (const remoteChallenge of remoteChallenges) {
        const old = await this.repository.findOneBy({ name: remoteChallenge.data.name, source: 'github' })
        if (old) await old.remove()
        
        const challenge = await this.repository.save(remoteChallenge.data)
        challenge.files = []
        for (const path of remoteChallenge.files) {
          const file = await this.filesService.addFileFromPath(path)
          file.challenge = remoteChallenge.data.id
        }
      }
      return true
    } catch (error) {
      throw new ForbiddenException(error.message)
    }

  }

  async all () {
    const challenges = await this.repository.find({ order: { source: 'ASC' }, relations: ['files']})

    return challenges.map(c => {
      if(c.files?.length > 0) c.files.map(f => {
        delete f.path
        delete f.creation
        return f
      })
      return c
    })
  }

  async getPointsAndSolvesForAChallenge(challenge: Challenge){
    const cached = await this.challengeCacheRepository.findOne({
      where: {
        challengeId: challenge.id
      }
    })
    if(!cached){
      return await this.updateChallengePoints(challenge)
    } 
    return cached
  }

  async updateChallengePoints (challenge: Challenge) {
    let valids = await this.submissionsService.findValidsForChallenge(challenge.id)

    return await this.challengeCacheRepository.save({
      challengeId: challenge.id,
      points: 500-valids.length,
      solves: valids.length,
    })
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
    // TODO REAL QUERY TO CHECK IF SOLVED ?
    const challenges = await this.repository.find({
      select: ['name', 'author', 'category', 'description', 'difficulty', 'id', 'challengeUrl', 'instance'],
      relations: ['submissions'],
      order: { category: 'ASC' },
      cache: 5000
    })
    for (const challenge of challenges) {
      const infos = await this.getPointsAndSolvesForAChallenge(challenge)
      challenge.solved = await this.checkIfSolved(user, challenge)
      challenge.points = infos.points
      challenge.solves = infos.solves
    }
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

