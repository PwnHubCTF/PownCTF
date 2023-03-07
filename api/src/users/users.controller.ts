import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { NeedRole } from 'src/auth/decorators/need-role.decorator';
import { Role } from 'src/auth/role.enum';
import { ChangeRolePayload } from './dto/change-role.payload';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @ApiQuery({name: 'limit', required: false})
  @ApiQuery({name: 'page', required: false})
  @ApiQuery({name: 'category', required: false})
  @Get()
  async getAll (@Query('limit') limit = '10', @Query('page') page = '0', @Query('category') category = null) {
    return this.usersService.getAllReducedInfos(parseInt(limit), parseInt(page), category);
  }

  @Get('infos/:userId')
  async getOne (@Param('userId') userId: string) {
    return this.usersService.getOneReduced(userId);
  }

  @ApiBearerAuth()
  @NeedRole(Role.Admin)
  @Post('rank/:userId')
  async changeRank (@Param('userId') userId: string, @Body() payload: ChangeRolePayload) {
    return this.usersService.changeRank(userId, payload);
  }

  @ApiBearerAuth()
  @ApiQuery({name: 'limit', required: false})
  @ApiQuery({name: 'page', required: false})
  @ApiQuery({name: 'category', required: false})
  @NeedRole(Role.Manager)
  @Get('admin')
  async getAdmin (@Query('limit') limit = '10', @Query('page') page = '0', @Query('category') category = null) {
    return this.usersService.all(parseInt(limit), parseInt(page), category);
  }
}
