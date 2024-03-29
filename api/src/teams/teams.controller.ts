import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { NeedRole } from 'src/auth/decorators/need-role.decorator';
import { Role } from 'src/auth/role.enum';
import { CTF_STATES } from 'src/configs/configs.settings';
import { CtfState } from 'src/configs/decorators/ctf-state.decorator';
import { InjectUser } from 'src/users/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { JoinTeamDto } from './dto/join-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamsService } from './teams.service';

@Controller('teams')
@ApiTags('teams')
export class TeamsController {
    constructor(private readonly service: TeamsService) { }

    @ApiBearerAuth()
    @NeedRole(Role.User)
    @Post()
    create (@InjectUser() user: User, @Body() createDto: CreateTeamDto) {
        return this.service.createTeam(user, createDto);
    }

    @ApiBearerAuth()
    @NeedRole(Role.User)
    @Post('join')
    join (@InjectUser() user: User, @Body() joinDto: JoinTeamDto) {
        return this.service.joinTeam(user, joinDto.name, joinDto.password);
    }

    @ApiBearerAuth()
    @NeedRole(Role.User)
    @CtfState(CTF_STATES.WAITING)
    @Delete('/mine')
    leaveMine (@InjectUser() user: User) {
        return this.service.leave(user);
    }

    @ApiBearerAuth()
    @NeedRole(Role.User)
    @CtfState(CTF_STATES.WAITING)
    @Delete('/kick/:id')
    kickUser (@InjectUser() user: User, @Param('id') userId: string) {
        return this.service.kickPlayer(user, userId);
    }

    @ApiBearerAuth()
    @NeedRole(Role.User)
    @Post('join/infos/:secret')
    infoFromSecret (@Param('secret') secret: string) {
        return this.service.getFromSecret(secret);
    }

    @ApiBearerAuth()
    @NeedRole(Role.User)
    @Post('join/direct/:secret')
    joinWithSecret (@InjectUser() user: User, @Param('secret') secret: string) {
        return this.service.joinTeamWithSecret(user, secret);
    }

    @ApiBearerAuth()
    @ApiQuery({name: 'limit', required: false})
    @ApiQuery({name: 'page', required: false})
    @ApiQuery({name: 'category', required: false})
    @Get()
    findForScoreboard (@Query('limit') limit = '10', @Query('page') page = '0', @Query('category') category = null) {
        return this.service.getAllReducedInfos(parseInt(limit), parseInt(page), category);
    }

    @ApiBearerAuth()
    @ApiQuery({name: 'limit', required: false})
    @ApiQuery({name: 'page', required: false})
    @ApiQuery({name: 'category', required: false})
    @Get('/list')
    findList (@Query('limit') limit = '10', @Query('page') page = '0', @Query('category') category = null) {
        return this.service.getAllList(parseInt(limit), parseInt(page), category);
    }

    @ApiBearerAuth()
    @ApiQuery({name: 'limit', required: false})
    @ApiQuery({name: 'page', required: false})
    @ApiQuery({name: 'category', required: false})
    @NeedRole(Role.Manager)
    @Get('admin')
    findAllAdmin (@Query('limit') limit = '10', @Query('page') page = '0', @Query('category') category = null) {
        return this.service.all(parseInt(limit), parseInt(page), category);
    }
    
    @ApiBearerAuth()
    @ApiQuery({name: 'limit', required: false})
    @ApiQuery({name: 'page', required: false})
    @NeedRole(Role.User)
    @CtfState(CTF_STATES.WAITING, CTF_STATES.STARTED)
    @Get('free')
    getFreeTeams (@InjectUser() user: User, @Query('limit') limit = '10', @Query('page') page = '0') {
        return this.service.getOpenTeams(parseInt(limit), parseInt(page), user.category?.id)
    }

    @ApiBearerAuth()
    @NeedRole(Role.User)
    @Get('mine')
    getMine (@InjectUser() user: User) {
        return this.service.getForUser(user)
    }

    @ApiBearerAuth()
    @NeedRole(Role.Manager)
    @Get('admin/:id')
    findOneAdmin (@Param('id') id: string) {
        return this.service.get(id);
    }

    @ApiBearerAuth()
    @Get(':id')
    findOne (@Param('id') id: string) {
        return this.service.findOneReduced(id);
    }

    @ApiBearerAuth()
    @CtfState(CTF_STATES.WAITING, CTF_STATES.STARTED)
    @NeedRole(Role.User)
    @Patch()
    update (@InjectUser() user: User, @Body() updateDto: UpdateTeamDto) {
        return this.service.update(user.team.id, updateDto);
    }

    @ApiBearerAuth()
    @NeedRole(Role.Manager)
    @Patch(':id')
    updateAdmin (@Param('id') id: string, @Body() updateDto: UpdateTeamDto) {
        return this.service.updateAdmin(id, updateDto);
    }

    @ApiBearerAuth()
    @NeedRole(Role.Manager)
    @Delete(':id')
    remove (@Param('id') id: string) {
        return this.service.remove(id);
    }
}
