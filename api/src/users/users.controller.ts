import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NeedRole } from 'src/auth/decorators/need-role.decorator';
import { Role } from 'src/auth/role.enum';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Get()
  async getAll () {
    return this.usersService.getAllReducedInfos();
  }

  @Get('infos/:userId')
  async getOne (@Param('userId') userId: string) {
    return this.usersService.getOneReduced(userId);
  }

  @ApiBearerAuth()
  @NeedRole(Role.Admin)
  @Get('admin')
  async getAdmin () {
    return this.usersService.all();
  }
}
