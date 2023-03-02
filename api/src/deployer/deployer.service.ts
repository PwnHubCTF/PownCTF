import { HttpService } from '@nestjs/axios';
import { ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { Role } from 'src/auth/role.enum';
import { ChallengesService } from 'src/challenges/challenges.service';
import { ConfigsService } from 'src/configs/configs.service';
import { User } from 'src/users/entities/user.entity';
@Injectable()
export class DeployerService {
  constructor(
    protected readonly configsService: ConfigsService,
    @Inject(forwardRef(() => ChallengesService)) protected readonly challengesService: ChallengesService,
    private readonly http: HttpService
  ) {}

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

  async resetCooldown (id: string, user: User) {
    const instance = await this.getInstanceStatus(id, user)
    await this.apiSetDestroyCooldown(instance.id)
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

      if (instance.serverUrl)
        if (challenge.web)
          challenge.challengeUrl = `http://${instance.serverUrl}:${instance.port}`
        else
          challenge.challengeUrl = `${instance.serverUrl} ${instance.port}`
      else
        challenge.challengeUrl = null

      challenge.save()
      return instance
    }
    if (!challenge) throw new ForbiddenException('This challenge is not an instance')
  }

  async apiGetInstances () {
    const url = await this.configsService.getValueFromKey('deployer.url')
    const token = await this.configsService.getValueFromKey('deployer.token')
    if (!url || !token) throw new ForbiddenException('Deployer informations are missing')
    try {
      let res = await this.http.get(`${url}/instances`, {
        headers: {
          'X-API-KEY': token
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
    const url = await this.configsService.getValueFromKey('deployer.url')
    const token = await this.configsService.getValueFromKey('deployer.token')
    if (!url || !token) throw new ForbiddenException('Deployer informations are missing')
    try {
      let res = await this.http.get(`${url}/single`, {
        headers: {
          'X-API-KEY': token
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
    const url = await this.configsService.getValueFromKey('deployer.url')
    const token = await this.configsService.getValueFromKey('deployer.token')
    if (!url || !token) throw new ForbiddenException('Deployer informations are missing')
    try {
      let res = await this.http.get(`${url}/single/challenge/${id}`, {
        headers: {
          'X-API-KEY': token
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
    const url = await this.configsService.getValueFromKey('deployer.url')
    const token = await this.configsService.getValueFromKey('deployer.token')
    if (!url || !token) throw new ForbiddenException('Deployer informations are missing')
    try {
      let res = await this.http.get(`${url}/instances/owner/${owner}/${id}`, {
        headers: {
          'X-API-KEY': token
        },
        timeout: 2000
      }).toPromise();
      return res.data
    } catch (error) {
      if (error.response?.data.message) throw new ForbiddenException(error.response.data.message)
      throw new ForbiddenException(error.message)
    }
  }

  async apiSetDestroyCooldown (instanceId: string) {
    const url = await this.configsService.getValueFromKey('deployer.url')
    const token = await this.configsService.getValueFromKey('deployer.token')
    if (!url || !token) throw new ForbiddenException('Deployer informations are missing')
    try {
      let res = await this.http.post(`${url}/instances/cooldown/${instanceId}`, {
        cooldown: 60*60
      }, {
        headers: {
          'X-API-KEY': token
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
    const url = await this.configsService.getValueFromKey('deployer.url')
    const token = await this.configsService.getValueFromKey('deployer.token')
    if (!url || !token) throw new ForbiddenException('Deployer informations are missing')

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

      let res = await this.http.post(`${url}/instances`, payload, {
        headers: {
          'X-API-KEY': token
        }
      }).toPromise();
      return res.data
    } catch (error) {
      if (error.response?.data.message) throw new ForbiddenException(error.response.data.message)
      throw new ForbiddenException(error.message)
    }
  }

  async apiDeploySingle (challengeId: string, githubUrl: string) {
    const url = await this.configsService.getValueFromKey('deployer.url')
    const token = await this.configsService.getValueFromKey('deployer.token')
    if (!url || !token) throw new ForbiddenException('Deployer informations are missing')
    try {
      let res = await this.http.post(`${url}/single`, {
        "githubUrl": githubUrl,
        "challengeId": challengeId
      }, {
        headers: {
          'X-API-KEY': token
        }
      }).toPromise();
      return res.data
    } catch (error) {
      if (error.response?.data.message) throw new ForbiddenException(error.response.data.message)
      throw new ForbiddenException(error.message)
    }
  }


  async apiStopSingle (id: any) {
    const url = await this.configsService.getValueFromKey('deployer.url')
    const token = await this.configsService.getValueFromKey('deployer.token')
    if (!url || !token) throw new ForbiddenException('Deployer informations are missing')
    try {
      let res = await this.http.delete(`${url}/single/${id}`, {
        headers: {
          'X-API-KEY': token
        }
      }).toPromise();
      return res.data
    } catch (error) {
      if (error.response?.data.message) throw new ForbiddenException(error.response.data.message)
      throw new ForbiddenException(error.message)

    }
  }
  async apiStop (id: any) {
    const url = await this.configsService.getValueFromKey('deployer.url')
    const token = await this.configsService.getValueFromKey('deployer.token')
    if (!url || !token) throw new ForbiddenException('Deployer informations are missing')
    try {
      let res = await this.http.delete(`${url}/instances/${id}`, {
        headers: {
          'X-API-KEY': token
        }
      }).toPromise();
      return res.data
    } catch (error) {
      // if (error.response?.data.message) throw new ForbiddenException(error.response.data.message)
      // throw new ForbiddenException(error.message)
    }
  }

}

