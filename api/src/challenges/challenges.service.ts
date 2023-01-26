import { HttpService } from '@nestjs/axios';
import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigsService } from 'src/configs/configs.service';
import { SubmissionsService } from 'src/submissions/submissions.service';
import { TeamsService } from 'src/teams/teams.service';
import { User } from 'src/users/entities/user.entity';
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
    private readonly http: HttpService
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
        const old = await this.repository.findOneBy({name: remoteChallenge.data.name, source: 'github'})
        if(old) await old.remove()

        await this.repository.save(remoteChallenge.data)
      }
      return true
    } catch (error) {
      throw new ForbiddenException(error.message)
    }

  }

  async all () {
    return await this.repository.find({ order: { source: 'ASC' } })
  }

  async getCategories () {
    const categories = await this.repository.find({
      select: ['category'],
      order: { category: 'ASC' },
      cache: 60000
    })

    return categories.filter((v, i, a) => a.findIndex(v2 => (v2.category === v.category)) === i).map(e => e.category)
  }

  async deploy(user: User, challengeId){
      const challenge = await this.findOne(challengeId)
      let url = await this.configsService.getValueFromKey('deployer.url')
      let token = await this.configsService.getValueFromKey('deployer.token')
      if (!url || !token) throw new ForbiddenException('Deployer informations are missing')
      
      await this.http.get(`${url}`).toPromise();
  }

  // For /challenges page
  async findForUser (user: User) {
    // TODO REAL QUERY TO CHECK IF SOLVED ?
    const challenges = await this.repository.find({
      select: ['name', 'author', 'category', 'description', 'difficulty', 'id'],
      relations: ['submissions'],
      order: { category: 'ASC' },
      cache: 5000
    })
    for (const challenge of challenges) {
      challenge.solved = await this.checkIfSolved(user, challenge)
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

