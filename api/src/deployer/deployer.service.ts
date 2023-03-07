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
  ) { }

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
      if(!instance) throw new ForbiddenException('Instance not found')
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

  async apiGetServerRessources () {
    return await this.apiRequest('get', `ressources`)
  }

  async apiGetInstances () {
    return await this.apiRequest('get', `instances`)
  }

  async apiGetInstancesSingle () {
    return await this.apiRequest('get', `single`)
  }

  async apiGetStatusSingle (id: string) {
    return await this.apiRequest('get', `single/challenge/${id}`)
  }

  async apiGetStatus (id: string, owner: string) {
    return await this.apiRequest('get', `instances/owner/${owner}/${id}`)
  }

  async apiSetDestroyCooldown (instanceId: string) {
    return await this.apiRequest('post', `instances/cooldown/${instanceId}`, {
      cooldown: 60 * 60
    })
  }

  async apiDeploy (challengeId: string, githubUrl: string, owner: string, forceFlag?: string) {
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
      
      return await this.apiRequest('post', `instances`, payload)
    } catch (error) {
      if (error.response?.data.message) throw new ForbiddenException(error.response.data.message)
      throw new ForbiddenException(error.message)
    }
  }

  async apiDeploySingle (challengeId: string, githubUrl: string) {
    return await this.apiRequest('post', `single`, {
      "githubUrl": githubUrl,
      "challengeId": challengeId
    })
  }


  async apiStopSingle (id: any) {
    return await this.apiRequest('delete', `single/${id}`)
  }

  async apiStop (id: any) {
    return await this.apiRequest('delete', `instances/${id}`)
  }

  async apiRequest (verb: 'delete' | 'get' | 'post' = "get", route, payload?) {
    const url = await this.configsService.getValueFromKey('deployer.url')
    const token = await this.configsService.getValueFromKey('deployer.token')
    if (!url || !token) throw new ForbiddenException('Deployer informations are missing')
    try {
      if (verb == 'post') {
        let res = await this.http.post(`${url}/${route}`, payload, {
          headers: {
            'X-API-KEY': token
          }
        }).toPromise();
        return res.data
      } else {
        let res = await this.http[verb](`${url}/${route}`, {
          headers: {
            'X-API-KEY': token
          }
        }).toPromise();
        return res.data
      }
    } catch (error) {
      // if (error.response?.data.message) throw new ForbiddenException(error.response.data.message)
      // throw new ForbiddenException(error.message)
    }
  }

}

