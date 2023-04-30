import { Body, Controller, Get, Param, Patch, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { NeedRole } from 'src/auth/decorators/need-role.decorator';
import { Role } from 'src/auth/role.enum';
import { ConfigsService } from './configs.service';
import { UpdateConfigDto } from './dto/update-config.dto';

@Controller('configs')
@ApiTags('config')
export class ConfigsController {
  constructor(private readonly configsService: ConfigsService) { }

  @Get('ctf')
  async getCtf () {
    const dates = await this.configsService.getDates()
    const timezone = await this.configsService.getServerTimezone()
    const state = await this.configsService.getState()
    const eventName = await this.configsService.getValueFromKey(`ctf.event_name`);
    const teamMode = await this.configsService.getValueFromKey(`ctf.team_mode`);
    const discordUrl = await this.configsService.getValueFromKey(`discord.invite_url`);
    const maxPlayersPerTeam = await this.configsService.getNumberFromKey(`ctf.players_max_per_team`);

    return { eventName, state, dates, timezone, teamMode, discordUrl, maxPlayersPerTeam }
  }

  @Get('logo')
  async getLogo (@Res() res: Response) {
    const file = createReadStream(join(process.cwd(), 'uploads/logo'))
    res.set({
      'Content-Type': 'image/svg+xml',
    });
    file.pipe(res);
  }

  @ApiBearerAuth()
  @NeedRole(Role.Manager)
  @Get()
  findAll () {
    return this.configsService.findAll();
  }

  @ApiBearerAuth()
  @NeedRole(Role.Manager)
  @Get('key/:key')
  findOne (@Param('key') key: string) {
    return this.configsService.findOne(key);
  }

  @ApiBearerAuth()
  @NeedRole(Role.Manager)
  @Patch('key/:key')
  async update (@Param('key') key: string, @Body() updateConfigDto: UpdateConfigDto) {
    return await this.configsService.update(key, updateConfigDto);
  }
}
