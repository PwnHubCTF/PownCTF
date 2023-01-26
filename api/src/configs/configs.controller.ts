import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NeedRole } from 'src/auth/decorators/need-role.decorator';
import { Role } from 'src/auth/role.enum';
import { ConfigsService } from './configs.service';
import { UpdateConfigDto } from './dto/update-config.dto';

@Controller('configs')
@ApiTags('config')
export class ConfigsController {
  constructor(private readonly configsService: ConfigsService) { }

  @Get('value/:key')
  async getPublicKey (@Param('key') key: string) {
    return await this.configsService.getValueFromKey(`ctf.${key}`);
  }

  @Get('state')
  async getState () {
    return this.configsService.getState()
  }

  @ApiBearerAuth()
  @NeedRole(Role.Admin)
  @Get()
  findAll () {
    return this.configsService.findAll();
  }

  @ApiBearerAuth()
  @NeedRole(Role.Admin)
  @Get('key/:key')
  findOne (@Param('key') key: string) {
    return this.configsService.findOne(key);
  }

  @ApiBearerAuth()
  @NeedRole(Role.Admin)
  @Patch('key/:key')
  async update (@Param('key') key: string, @Body() updateConfigDto: UpdateConfigDto) {
    return await this.configsService.update(key, updateConfigDto);
  }
}
