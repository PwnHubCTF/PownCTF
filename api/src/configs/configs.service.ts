import { ForbiddenException, Injectable } from '@nestjs/common';
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
    // const timezone = await this.getValueFromKey('ctf.timezone')
    const startAt = await this.getValueFromKey('ctf.start_at')
    const endAt = await this.getValueFromKey('ctf.end_at')
    return { startAt, endAt }
  }

  async getState () {
    // const timezone = await this.getValueFromKey('ctf.timezone')
    const startAt = new Date((await this.getValueFromKey('ctf.start_at')))
    const endAt = new Date((await this.getValueFromKey('ctf.end_at')))
    // console.log(startAt, endAt);
    // console.log(Date.now());
    
    
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

  async getNumberFromKey (key: string) {
    return parseInt((await this.findOne(key))?.value)
  }
  
  async getBooleanFromKey (key: string) {
    return (await this.findOne(key))?.value === 'true' ? true : false
  }

  async update (key: string, updateConfigDto: UpdateConfigDto) {
    // IDK where to do this properly
    if(key === 'github.repo_url'){
      if(updateConfigDto.value.includes('http') || updateConfigDto.value.includes('.git')){
        throw new ForbiddenException('this value cannot includes http or .git')
      }
      if(updateConfigDto.value[updateConfigDto.value.length-1] == '/'){
        throw new ForbiddenException('Please remove "/" at the end of url')
      }
    }
    return await this.configRepository.save({ key, value: updateConfigDto.value })
  }
}