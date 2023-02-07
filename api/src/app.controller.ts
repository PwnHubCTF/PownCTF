import { Body, Controller, Get, Header, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AppService } from './app.service';
import { NeedRole } from './auth/decorators/need-role.decorator';
import { Role } from './auth/role.enum';
import { ThemeDto } from './theme.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('scoreboard')
  getScoreboard () {
    return this.appService.getScoreboard();
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
