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

  async createBasicConfigs () {
    for (const config of configs) {
      let currentConfig = await this.findOne(config.key)
      if (!currentConfig) {
        this.configRepository.create(config).save()
      }
    }
  }

  async findAll () {
    let configs = await this.configRepository.find({ cache: 5000 });
    return configs.map(c => {
      return {
        ...c, valueChoices: JSON.parse(c.valueChoices)
      }
    })
  }

  findOne (key: string) {
    return this.configRepository.findOne({ where: { key }, cache: 5000 });
  }

  async getValueFromKey (key: string) {
    let config = await this.findOne(key)
    return config.value
  }

  update (key: string, updateConfigDto: UpdateConfigDto) {
    return this.configRepository.save({ key, ...updateConfigDto })
  }
}
