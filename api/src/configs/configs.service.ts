import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { configs, CTF_STATES } from './configs.settings';
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
      const currentConfig = await this.findOne(config.key)
      if (!currentConfig) {
        this.configRepository.create(config).save()
      }
    }
  }

  async getDates () {
    const startAt = await this.getValueFromKey('ctf.start_at')
    const endAt = await this.getValueFromKey('ctf.end_at')
    return { startAt, endAt }
  }

  async getState () {
    const startAt = new Date((await this.getValueFromKey('ctf.start_at')))
    const endAt = new Date((await this.getValueFromKey('ctf.end_at')))
    if (startAt as any - Date.now() < 0)
      return endAt as any - Date.now() > 0 ? CTF_STATES.STARTED : CTF_STATES.FINISHED
    return CTF_STATES.WAITING
  }

  async findAll () {
    let configs = await this.configRepository.find();
    return configs.map(c => {
      return {
        ...c, valueChoices: JSON.parse(c.valueChoices)
      }
    })
  }

  async findOne (key: string) {
    return await this.configRepository.findOne({ where: { key }, cache: 5000 });
  }

  async getValueFromKey (key: string) {
    return (await this.findOne(key))?.value

  }

  async update (key: string, updateConfigDto: UpdateConfigDto) {
    return await this.configRepository.save({ key, value: updateConfigDto.value })
  }
}