import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
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

  @ApiBearerAuth()
  @ApiQuery({name: 'limit', required: false})
  @ApiQuery({name: 'page', required: false})
  @ApiQuery({name: 'category', required: false})
  @Get()
  async getAllScoreboard (@Query('limit') limit = '10', @Query('page') page = '0', @Query('category') category = null) {
    return this.usersService.getAllScoreboard(parseInt(limit), parseInt(page), category);
  }

  @ApiBearerAuth()
  @ApiQuery({name: 'limit', required: false})
  @ApiQuery({name: 'page', required: false})
  @ApiQuery({name: 'category', required: false})
  @Get('all-users')
  async getUsers (@Query('limit') limit = '10', @Query('page') page = '0', @Query('category') category = null) {
    return this.usersService.allUsers(parseInt(limit), parseInt(page), category);
  }

  @ApiBearerAuth()
  @NeedRole(Role.Manager)
  @Delete(':id')
  async delete (@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @ApiBearerAuth()
  @ApiQuery({name: 'limit', required: false})
  @ApiQuery({name: 'page', required: false})
  @ApiQuery({name: 'category', required: false})
  @ApiQuery({name: 'search', required: false})
  @NeedRole(Role.Manager)
  @Get('admin')
  async getAdmin (@Query('limit') limit = '10', @Query('page') page = '0', @Query('search') search = null, @Query('category') category = null) {
    return this.usersService.all(parseInt(limit), parseInt(page), category, search);
  }

  @ApiBearerAuth()
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
  @NeedRole(Role.Manager)
  @Post('spaceship/:userId')
  async spaceship (@Param('userId') userId: string, @Body('spaceship') spaceship: boolean) {
    return this.usersService.addSpaceship(userId, spaceship);
  }

  @ApiBearerAuth()
  @NeedRole(Role.Manager)
  @Delete('team/:id')
  removeFromTeam (@Param('id') id: string) {
    return this.usersService.kickFromTeam(id);
  }

  @ApiBearerAuth()
  @NeedRole(Role.Manager)
  @Delete('category/:id')
  removeFromCategory (@Param('id') id: string) {
    return this.usersService.kickFromCategory(id);
  }

  @ApiBearerAuth()
  @NeedRole(Role.Manager)
  @Patch(':id')
  update (@Param('id') id: string, @Body() updateDto: any) {
      return this.usersService.update(id, updateDto);
  }
}
