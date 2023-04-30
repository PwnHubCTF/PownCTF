import { Body, Controller, Get, Header, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { AppService } from './app.service';
import { NeedRole } from './auth/decorators/need-role.decorator';
import { Role } from './auth/role.enum';
import { ThemeDto } from './theme.dto';
import { CTF_STATES } from './configs/configs.settings';
import { CtfState } from './configs/decorators/ctf-state.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @ApiQuery({name: 'category', required: false})
  @CtfState(CTF_STATES.STARTED, CTF_STATES.FINISHED)
  @Get('scoreboard')
  getScoreboard (@Query('category') category = null) {
    return this.appService.getScoreboard(category);
  }

  @Get('theme.css')
  @Header('content-type', 'text/css')
  getTheme () {
    return this.appService.getTheme();
  }
  
  @ApiBearerAuth()
  @NeedRole(Role.Manager)
  @Post('theme')
  setTheme (@Body() payload: ThemeDto) {
    return this.appService.setTheme(payload.theme);
  }
}
