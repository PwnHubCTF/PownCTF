import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { configs } from './configs.settings';
import { UpdateConfigDto } from './dto/update-config.dto';
import { Config } from './entities/config.entity';

@Injectable()
export class ConfigsService {
  constructor(
    @InjectRepository(Config)
    private readonly configRepository: Repository<Config>
  ) {
    this.createBasicConfigs()
  }

  async createBasicConfigs(){
    for (const config of configs) {
      let currentConfig = await this.findOne(config.key)
      if(!currentConfig){
        this.configRepository.create(config).save()
      }
    }
  }

  findAll () {
    return this.configRepository.find();
  }

  findOne (key: string) {
    return this.configRepository.findOneBy({key});
  }

  async getValueFromKey (key: string) {
    let config = await this.configRepository.findOneBy({key});
    return config.value
  }

  update (key: string, updateConfigDto: UpdateConfigDto) {
    return this.configRepository.save({key, ...updateConfigDto})
  }
}
