import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigsService } from 'src/configs/configs.service';
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

  async setup () {
    this.url = await this.configsService.getValueFromKey('deployer.url')
    this.token = await this.configsService.getValueFromKey('deployer.token')
  }

  async getStatusSingle (id: string) {
    if (!this.url || !this.token) throw new ForbiddenException('Deployer informations are missing')
    try {
      let res = await this.http.get(`${this.url}/single/challenge/${id}`, {
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

  async getStatus (id: string, pseudo: string) {
    if (!this.url || !this.token) throw new ForbiddenException('Deployer informations are missing')
    try {
      let res = await this.http.get(`${this.url}/instances/owner/${pseudo}/${id}`, {
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

  async deploy (challengeId: string, githubUrl: string, owner: string, team: string) {
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

  
  async stopSingle (id: any) {
    if (!this.url || !this.token) throw new ForbiddenException('Deployer informations are missing')
    try {
      let res = await this.http.delete(`${this.url}/single/${id}`, {
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
  async stop (id: any) {
    if (!this.url || !this.token) throw new ForbiddenException('Deployer informations are missing')
    try {
      let res = await this.http.delete(`${this.url}/instances/${id}`, {
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

