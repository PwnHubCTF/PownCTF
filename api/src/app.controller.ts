import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';

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
}
