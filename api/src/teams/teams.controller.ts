import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NeedRole } from 'src/auth/decorators/need-role.decorator';
import { Role } from 'src/auth/role.enum';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamsService } from './teams.service';

@Controller('teams')
@ApiTags('teams')
export class TeamsController {
    constructor(private readonly service: TeamsService) { }

    @ApiBearerAuth()
    @NeedRole(Role.User)
    @Post()
    create (@Body() createDto: CreateTeamDto) {
        return this.service.create(createDto);
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
