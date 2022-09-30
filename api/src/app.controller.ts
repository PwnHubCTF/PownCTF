import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Role } from './auth/role.enum';
import { NeedRole } from './auth/decorators/need-role.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello (): string {
    return this.appService.getHello();
  }
  
  @ApiBearerAuth()
  @NeedRole(Role.User)
  @Get('/user')
  getHelloUser (): string {
    return this.appService.getHello();
  }
  
  @ApiBearerAuth()
  @NeedRole(Role.Admin)
  @Get('/admin')
  getHelloAdmin (): string {
    return this.appService.getHello();
  }
}
