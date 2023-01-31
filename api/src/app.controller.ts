import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppService } from './app.service';
import { NeedRole } from './auth/decorators/need-role.decorator';
import { Role } from './auth/role.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('scoreboard')
  getScoreboard () {
    return this.appService.getScoreboard();
  }
}
