import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { BaseCrudService } from 'src/utils/base-crud.service';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamsService extends BaseCrudService<Team>{

    constructor(@InjectRepository(Team) protected readonly repository: Repository<Team>){
        super(repository)
    }

    async createTeam(user: User, createDto: CreateTeamDto){
        console.log(user, createDto);
    }

}
