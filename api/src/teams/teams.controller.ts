import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NeedRole } from 'src/auth/decorators/need-role.decorator';
import { Role } from 'src/auth/role.enum';
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
    @Post('join/:name')
    join (@InjectUser() user: User, @Param('name') name: string, @Body() joinDto: JoinTeamDto) {
        return this.service.joinTeam(user, name, joinDto.password);
    }

    @ApiBearerAuth()
    @NeedRole(Role.User)
    @Post('join/direct/:secret')
    joinWithSecret (@InjectUser() user: User, @Param('secret') secret: string) {
        return this.service.joinTeamWithSecret(user, secret);
    }

    @Get()
    findAll () {
        return this.service.findAll();
    }

    @Get(':id')
    findOne (@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @ApiBearerAuth()
    @NeedRole(Role.User)
    @Patch(':id')
    update (@Param('id') id: string, @Body() updateDto: UpdateTeamDto) {
        return this.service.update(id, updateDto);
    }

    @ApiBearerAuth()
    @NeedRole(Role.Admin)
    @Delete(':id')
    remove (@Param('id') id: string) {
        return this.service.remove(id);
    }
}
