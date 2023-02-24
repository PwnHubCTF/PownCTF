import { HttpService } from '@nestjs/axios';
import { ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { ChallengesService } from 'src/challenges/challenges.service';
import { SubmitXssDto } from 'src/challenges/dto/submit-xss.dto';
import { ConfigsService } from 'src/configs/configs.service';
import { DeployerService } from 'src/deployer/deployer.service';
import { User } from 'src/users/entities/user.entity';
@Injectable()
export class XSSBotService {

  private cooldown = []

  constructor(
    protected readonly configsService: ConfigsService,
    @Inject(forwardRef(() => ChallengesService)) protected readonly challengesService: ChallengesService,
    private readonly deployerService: DeployerService,
    private readonly http: HttpService,
  ) {}


  async sendXss(user: User, challengeId: string, payload: SubmitXssDto) {
    try {
      const challenge = await this.challengesService.findOne(challengeId)
      if(!challenge.xss) throw new ForbiddenException(`This challenge doesn't support xss bot`)
      // Get deployed challenge
      const status = await this.deployerService.getInstanceStatus(challenge.id, user)
      if(!(status.serverUrl && status.port)) throw new ForbiddenException(`This challenge is not build`)
    
      const targetHost = `${status.serverUrl}:${status.port}`      
      const url = new URL(payload.payload)
      if(url.host != targetHost) throw new ForbiddenException(`Host must be equal to ${targetHost}`)

      const flag = challenge.signedFlag ? await this.challengesService.signFlagFromChallengeAndUser(challengeId, user.id) : challenge.flag
      
      // Cooldown
      if(this.cooldown.find(id => id == user.id)) throw new ForbiddenException(`Wait a little bit before sending another url`)
      this.cooldown.push(user.id)
      setTimeout(() => {
        this.cooldown = this.cooldown.filter(id => id != user.id)
      }, 10000);

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

  async getBotStatus(){
    const url = await this.configsService.getValueFromKey('xss_bot.url')
    const token = await this.configsService.getValueFromKey('xss_bot.token')
    if(!url || !token) return false
    try {
      let res = await this.http.get(`${url}`, {
        headers: {
          'X-BOT-KEY': token
        },
        timeout: 2000
      }).toPromise();
      return true
    } catch (error) {
      if (error.response?.data.message) throw new ForbiddenException("BOT CONFIG " + error.response.data.message)
      throw new ForbiddenException("BOT CONFIG " +error.message)
    }
  }

  async postXss(xssUrl: string, cookie: any){
    const url = await this.configsService.getValueFromKey('xss_bot.url')
    const token = await this.configsService.getValueFromKey('xss_bot.token')
    if(!url || !token) throw new ForbiddenException(`BOT Config not set`)
    
    try {
      let res = await this.http.post(`${url}`, {
        url:xssUrl,
        cookie
      },{
        headers: {
          'X-BOT-KEY': token
        },
        timeout: 10000
      }).toPromise();
      return res.data
    } catch (error) {
      if (error.response?.data.message) throw new ForbiddenException(error.response.data.message)
      throw new ForbiddenException(error.message)
    }
  }

}

