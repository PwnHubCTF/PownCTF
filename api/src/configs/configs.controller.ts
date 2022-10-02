import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigsService } from './configs.service';
import { UpdateConfigDto } from './dto/update-config.dto';

@Controller('configs')
@ApiTags('config')
export class ConfigsController {
  constructor(private readonly configsService: ConfigsService) { }

  @Get()
  findAll () {
    return this.configsService.findAll();
  }

  @Get(':key')
  findOne (@Param('key') key: string) {
    return this.configsService.findOne(key);
  }

  @Patch(':key')
  update (@Param('key') key: string, @Body() updateConfigDto: UpdateConfigDto) {
    return this.configsService.update(key, updateConfigDto);
  }
}
