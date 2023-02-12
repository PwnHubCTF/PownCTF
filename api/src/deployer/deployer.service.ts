import { HttpService } from '@nestjs/axios';
import { ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { Role } from 'src/auth/role.enum';
import { ChallengesService } from 'src/challenges/challenges.service';
import { ConfigsService } from 'src/configs/configs.service';
import { User } from 'src/users/entities/user.entity';
@Injectable()
export class DeployerService {
  private url
  private token
  constructor(
    protected readonly configsService: ConfigsService,
    @Inject(forwardRef(() => ChallengesService))  protected readonly challengesService: ChallengesService,
    private readonly http: HttpService
  ) {
    this.setup()
  }

  async setup () {
    this.url = await this.configsService.getValueFromKey('deployer.url')
    this.token = await this.configsService.getValueFromKey('deployer.token')
  }



  async deploy (challengeId: string, user: User) {
    const challenge = await this.challengesService.findOne(challengeId)
    if (!challenge.githubUrl) throw new ForbiddenException('githubUrl information is missing')
    if (challenge.instance == 'multiple') {
      let userflag = undefined
      if (challenge.signedFlag) {
        userflag = await this.challengesService.signFlagFromChallengeAndUser(challenge.id, user.id)
      }
      let owner = user.id
      const isTeamMode = await this.configsService.getBooleanFromKey('ctf.team_mode')
      if (isTeamMode) owner = user.team.id

      return this.apiDeploy(challenge.id, challenge.githubUrl, owner, userflag)

    }
    if (challenge.instance == 'single') {
      if (user.role == Role.User) throw new ForbiddenException('You can\'t deploy this challenge')
      return this.apiDeploySingle(challenge.id, challenge.githubUrl)
    }
    if (!challenge) throw new ForbiddenException('This challenge is not an instance')

  }

  async stop (id: string, user: User) {
    try {
      const instance = await this.getInstanceStatus(id, user)
    const challenge = await this.challengesService.findOne(id)
    if (challenge.instance == 'multiple') {
      return this.apiStop(instance.id)
    }
    if (challenge.instance == 'single') {
      if (user.role == Role.User) throw new ForbiddenException('You can\'t stop this challenge')
      return this.apiStopSingle(instance.id)
    }
    if (!challenge) throw new ForbiddenException('This challenge is not an instance')
    } catch (error) {
      console.error('Imossible to stop instance (deployer is probably down)')
    }

  }

  async getInstances () {
    return {
      single: await this.apiGetInstancesSingle(),
      multiple: await this.apiGetInstances(),
    }
  }

  async getInstanceStatus (id: string, user: User) {
    const challenge = await this.challengesService.findOne(id)
    if (challenge.instance == 'multiple') {
      const isTeamMode = await this.configsService.getBooleanFromKey('ctf.team_mode')
      if (!isTeamMode) return this.apiGetStatus(challenge.id, user.id)
      return this.apiGetStatus(challenge.id, user.team.id)
    }
    if (challenge.instance == 'single') {
      if (user.role == Role.User) throw new ForbiddenException('You can\'t view this instance')
      const instance = await this.apiGetStatusSingle(challenge.id)

      if (instance.url)
        challenge.challengeUrl = instance.url
      else
        challenge.challengeUrl = null

      challenge.save()
      return instance
    }
    if (!challenge) throw new ForbiddenException('This challenge is not an instance')
  }

  async apiGetInstances () {
    if (!this.url || !this.token) throw new ForbiddenException('Deployer informations are missing')
    try {
      let res = await this.http.get(`${this.url}/instances`, {
        headers: {
          'X-API-KEY': this.token
        },
        timeout: 2000
      }).toPromise();
      return res.data
    } catch (error) {
      if (error.response?.data.message) throw new ForbiddenException(error.response.data.message)
      throw new ForbiddenException(error.message)
    }
  }

  async apiGetInstancesSingle () {
    if (!this.url || !this.token) throw new ForbiddenException('Deployer informations are missing')
    try {
      let res = await this.http.get(`${this.url}/single`, {
        headers: {
          'X-API-KEY': this.token
        },
        timeout: 2000
      }).toPromise();
      return res.data
    } catch (error) {
      if (error.response?.data.message) throw new ForbiddenException(error.response.data.message)
      throw new ForbiddenException(error.message)
    }
  }

  async apiGetStatusSingle (id: string) {
    this.url = await this.configsService.getValueFromKey('deployer.url')
    this.token = await this.configsService.getValueFromKey('deployer.token')
    if (!this.url || !this.token) throw new ForbiddenException('Deployer informations are missing')
    try {
      let res = await this.http.get(`${this.url}/single/challenge/${id}`, {
        headers: {
          'X-API-KEY': this.token
        },
        timeout: 2000
      }).toPromise();
      return res.data
    } catch (error) {
      if (error.response?.data.message) throw new ForbiddenException(error.response.data.message)
      throw new ForbiddenException(error.message)
    }
  }

  async apiGetStatus (id: string, owner: string) {
    if (!this.url || !this.token) throw new ForbiddenException('Deployer informations are missing')
    try {
      let res = await this.http.get(`${this.url}/instances/owner/${owner}/${id}`, {
        headers: {
          'X-API-KEY': this.token
        },
        timeout: 2000
      }).toPromise();
      return res.data
    } catch (error) {
      if (error.response?.data.message) throw new ForbiddenException(error.response.data.message)
      throw new ForbiddenException(error.message)
    }
  }

  async apiDeploy (challengeId: string, githubUrl: string, owner: string, forceFlag?: string) {
    if (!this.url || !this.token) throw new ForbiddenException('Deployer informations are missing')

    try {
      let payload: any = {
        "githubUrl": githubUrl,
        "owner": owner,
        "challengeId": challengeId,
      }

      if (forceFlag) {
        payload.customEnv = {
          FLAG: forceFlag,
        }
      }

      let res = await this.http.post(`${this.url}/instances`, payload, {
        headers: {
          'X-API-KEY': this.token
        }
      }).toPromise();
      return res.data
    } catch (error) {
      if (error.response?.data.message) throw new ForbiddenException(error.response.data.message)
      throw new ForbiddenException(error.message)
    }
  }

  async apiDeploySingle (challengeId: string, githubUrl: string) {
    if (!this.url || !this.token) throw new ForbiddenException('Deployer informations are missing')
    try {
      let res = await this.http.post(`${this.url}/single`, {
        "githubUrl": githubUrl,
        "challengeId": challengeId
      }, {
        headers: {
          'X-API-KEY': this.token
        }
      }).toPromise();
      return res.data
    } catch (error) {
      if (error.response?.data.message) throw new ForbiddenException(error.response.data.message)
      throw new ForbiddenException(error.message)
    }
  }


  async apiStopSingle (id: any) {
    if (!this.url || !this.token) throw new ForbiddenException('Deployer informations are missing')
    try {
      let res = await this.http.delete(`${this.url}/single/${id}`, {
        headers: {
          'X-API-KEY': this.token
        }
      }).toPromise();
      return res.data
    } catch (error) {
      if (error.response?.data.message) throw new ForbiddenException(error.response.data.message)
      throw new ForbiddenException(error.message)

    }
  }
  async apiStop (id: any) {
    if (!this.url || !this.token) throw new ForbiddenException('Deployer informations are missing')
    try {
      let res = await this.http.delete(`${this.url}/instances/${id}`, {
        headers: {
          'X-API-KEY': this.token
        }
      }).toPromise();
      return res.data
    } catch (error) {
      if (error.response?.data.message) throw new ForbiddenException(error.response.data.message)
      throw new ForbiddenException(error.message)
    }
  }

}

