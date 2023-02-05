import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { NeedRole } from 'src/auth/decorators/need-role.decorator';
import { Role } from 'src/auth/role.enum';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @ApiQuery({name: 'limit', required: false})
  @ApiQuery({name: 'page', required: false})
  @Get()
  async getAll (@Query('limit') limit = '10', @Query('page') page = '0') {
    return this.usersService.getAllReducedInfos(parseInt(limit), parseInt(page));
  }

  @Get('infos/:userId')
  async getOne (@Param('userId') userId: string) {
    return this.usersService.getOneReduced(userId);
  }

  @ApiBearerAuth()
  @ApiQuery({name: 'limit', required: false})
  @ApiQuery({name: 'page', required: false})
  @NeedRole(Role.Admin)
  @Get('admin')
  async getAdmin (@Query('limit') limit = '10', @Query('page') page = '0') {
    return this.usersService.all(parseInt(limit), parseInt(page));
  }
}
