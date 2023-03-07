import { HttpService } from '@nestjs/axios';
import { ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChallengesService } from 'src/challenges/challenges.service';
import { ConfigsService } from 'src/configs/configs.service';
import { DeployerService } from 'src/deployer/deployer.service';
import { User } from 'src/users/entities/user.entity';
import { SubmitXssDto } from 'src/xssbot/dto/submit-xss.dto';
import { Repository } from 'typeorm';
import { XSSSubmission } from './entities/xss-submission.entity';
@Injectable()
export class XSSBotService {
  private cooldown = []

  constructor(
    @InjectRepository(XSSSubmission) protected readonly repository: Repository<XSSSubmission>,
    protected readonly configsService: ConfigsService,
    @Inject(forwardRef(() => ChallengesService)) protected readonly challengesService: ChallengesService,
    private readonly deployerService: DeployerService,
    private readonly http: HttpService,
  ) { }

  async all (limit = 10, page = 0) {
    const count = await this.repository.count()
    const submissions = await this.repository.find({
      take: limit,
      skip: page * limit
    })

    return {
      data: submissions, count
    }
  }

  async sendXss (user: User, challengeId: string, payload: SubmitXssDto) {
    try {
      const challenge = await this.challengesService.findOne(challengeId)
      if (!challenge.xss) throw new ForbiddenException(`This challenge doesn't support xss bot`)
      // Get deployed challenge
      const status = await this.deployerService.getInstanceStatus(challenge.id, user)
      if (!(status.serverUrl && status.port)) throw new ForbiddenException(`This challenge is not build`)

      const targetHost = `${status.serverUrl}:${status.port}`
      const url = new URL(payload.payload)
      if (url.host != targetHost) throw new ForbiddenException(`Host must be equal to ${targetHost}`)

      const flag = challenge.signedFlag ? await this.challengesService.signFlagFromChallengeAndUser(challengeId, user.id) : challenge.flag

      // Cooldown
      if (this.cooldown.find(id => id == user.id)) throw new ForbiddenException(`Wait a little bit before sending another url`)
      this.cooldown.push(user.id)
      setTimeout(() => {
        this.cooldown = this.cooldown.filter(id => id != user.id)
      }, 10000);

      this.repository.save({
        challengeId,
        payload: payload.payload,
        userId: user.id
      })

      await this.postXss(payload.payload, {
        name: "flag",
        value: flag,
        domain: url.host,
      })

      return true
    } catch (error) {
      throw new ForbiddenException(error.message)
    }

  }

  async getBotStatus () {
    this.apiRequest('get', '')
  }

  async postXss (url: string, cookie: any) {
    this.apiRequest('post', '', {
      url, cookie
    })
  }

  async apiRequest (verb: 'delete' | 'get' | 'post' = "get", route, payload?) {
    const url = await this.configsService.getValueFromKey('xss_bot.url')
    const token = await this.configsService.getValueFromKey('xss_bot.token')
    if (!url || !token) throw new ForbiddenException(`BOT Config not set`)

    try {
      const headers = {
        'X-BOT-KEY': token
      }

      if (verb == 'post') {
        let res = await this.http.post(`${url}/${route}`, payload, {
          headers,
        }).toPromise();
        return res.data
      } else {
        let res = await this.http[verb](`${url}/${route}`, {
          headers,
        }).toPromise();
        return res.data
      }
    } catch (error) {
      if (error.response?.data.message) throw new ForbiddenException(error.response.data.message)
      throw new ForbiddenException(error.message)
    }
  }

}

