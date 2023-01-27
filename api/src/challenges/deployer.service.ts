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
export class DeployerService {
  private url
  private token
  constructor(
    protected readonly configsService: ConfigsService,
    private readonly http: HttpService
  ) {
    this.setup()
  }

  async setup(){
    this.url = await this.configsService.getValueFromKey('deployer.url')
    this.token = await this.configsService.getValueFromKey('deployer.token')
  }

  async deploy(challengeId: string, githubUrl: string, owner: string, team: string) {
    if (!this.url || !this.token) throw new ForbiddenException('Deployer informations are missing')
    try {
      let res = await this.http.post(`${this.url}/instances`, {
        "githubUrl": githubUrl,
        "owner": owner,
        "team": team,
        "challengeId": challengeId
      }, {
        headers: {
          'X-API-KEY': this.token
        }
      }).toPromise();
      return res.data
    } catch (error) {
      console.log(error);
      throw new ForbiddenException(error.message)
    }
  }

  async deploySingle (challengeId: string, githubUrl: string) {
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
      console.log(error);
      throw new ForbiddenException(error.message)
    }
  }


}

