import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppService } from './app.service';
import { NeedRole } from './auth/decorators/need-role.decorator';
import { Role } from './auth/role.enum';

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
