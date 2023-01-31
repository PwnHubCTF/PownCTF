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
      if(error.response?.data.message) throw new ForbiddenException(error.response.data.message)
      throw new ForbiddenException(error.message)
    }
  }

  async getStatus (id: string, owner: string) {
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
      if(error.response?.data.message) throw new ForbiddenException(error.response.data.message)
      throw new ForbiddenException(error.message)
    }
  }

  async deploy (challengeId: string, githubUrl: string, owner: string) {
    if (!this.url || !this.token) throw new ForbiddenException('Deployer informations are missing')
    try {
      let res = await this.http.post(`${this.url}/instances`, {
        "githubUrl": githubUrl,
        "owner": owner,
        "challengeId": challengeId
      }, {
        headers: {
          'X-API-KEY': this.token
        }
      }).toPromise();
      return res.data
    } catch (error) {
      if(error.response?.data.message) throw new ForbiddenException(error.response.data.message)
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
      if(error.response?.data.message) throw new ForbiddenException(error.response.data.message)
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
      if(error.response?.data.message) throw new ForbiddenException(error.response.data.message)
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
      if(error.response?.data.message) throw new ForbiddenException(error.response.data.message)
      throw new ForbiddenException(error.message)
    }
  }

}

