import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, createHmac } from 'crypto';
import { User } from 'src/users/entities/user.entity';
import { BaseCrudService } from 'src/utils/base-crud.service';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamsService extends BaseCrudService<Team>{

    constructor(@InjectRepository(Team) protected readonly repository: Repository<Team>) {
        super(repository)
    }


    async findOneReduced (id: string) {
        const teams = await this.repository.createQueryBuilder()
            .select('id,name')
            .where({ id })
            .cache(true)
            .execute()
        return teams[0]
    }
    async findAllReduced () {
        const teams = await this.repository.createQueryBuilder()
            .select('id,name')
            .cache(true)
            .execute()
        return teams
    }

    async createTeam (user: User, createDto: CreateTeamDto) {
        if (user.team) throw new ForbiddenException('You already have a team')
        const secretHash = createHmac('sha512', `${createDto.name}${createDto.password}`).digest('hex');
        await this.create({ name: createDto.name, password: createDto.password, leader: user, secretHash: secretHash })
        return await this.joinTeamWithSecret(user, secretHash)
    }

    async joinTeam (user: User, teamName: string, password: string) {
        if (user.team) throw new ForbiddenException('You already have a team')

        const team = await this.repository.findOneBy({ name: teamName })
        if (!team) throw new ForbiddenException('Team does not exists')

        if (team.password !== password) throw new ForbiddenException('Incorrect password')

        user.team = team
        user.save()
        return 'Team joined !'
    }

    async joinTeamWithSecret (user: User, secret: string) {
        if (user.team) throw new ForbiddenException('You already have a team')

        const team = await this.repository.findOneBy({ secretHash: secret })
        if (!team) throw new ForbiddenException('Team does not exists')

        user.team = team
        user.save()
        return 'Team joined !'
    }

}
