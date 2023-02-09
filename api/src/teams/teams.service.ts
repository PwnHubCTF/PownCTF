import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, createHmac } from 'crypto';
import { ConfigsService } from 'src/configs/configs.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { BaseCrudService } from 'src/utils/base-crud.service';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamsService extends BaseCrudService<Team>{

    constructor(@InjectRepository(Team) protected readonly repository: Repository<Team>,
        private usersService: UsersService,
        private configService: ConfigsService,
    ) {
        super(repository)
    }

    async getForUser (user: User) {
        return user.team
    }

    async findOneReduced (id: string) {
        let team = await this.repository.findOne({ where: { id }, select: ['id', 'name'], relations: ['users'], cache: true })
        team.users = team.users.map(u => ({ id: u.id, pseudo: u.pseudo })) as any
        return team
    }

    async getTop10Submissions () {
        const teams = await this.getAllReducedInfos(10, 0)

        return await this.repository.query(`
        SELECT submission.creation as time, challenge.points, challenge.name, team.name as team FROM submission 
        INNER JOIN challenge ON challenge.id = submission.challengeId 
        INNER JOIN user ON submission.userId = user.id
        INNER JOIN team ON team.id = user.teamId
        WHERE user.teamId in ('${teams.data.map(u => u.id).join("', '")}')
        ORDER BY user.points DESC
        `)
    }

    async getAllReducedInfos (limit, page) {
        if(limit < 0 || page < 0) throw new ForbiddenException('Value error')
        const count = await this.repository.count()
        const teams = await this.repository.query(`
        SELECT @r := @r+1 as rank, 
           z.* 
        FROM(        SELECT sum(user.points) AS points, team.name as pseudo, team.id FROM team JOIN user ON user.teamId = team.id GROUP BY team.name ORDER BY sum(user.points) DESC LIMIT ${page*limit},${limit})z, 
        (SELECT @r:=${limit*page})y
        `)
    
        return {
          data: teams, count
        }
    }

    async createTeam (user: User, createDto: CreateTeamDto) {
        if (user.team) throw new ForbiddenException('You already have a team')
        const secretHash = createHmac('sha512', `${createDto.name}${createDto.password}`).digest('hex');
        await this.create({ name: createDto.name, password: createDto.password, leader: user, secretHash: secretHash })
        return await this.joinTeam(user, createDto.name, createDto.password)
    }

    async joinTeam (user: User, teamName: string, password: string) {
        if (user.team) throw new ForbiddenException('You already have a team')

        const team = await this.repository.findOne({ where :{name: teamName}, relations: ['users', 'leader', 'leader.category'] })
        
        if (!team) throw new ForbiddenException('Team does not exists')
        if (team.password !== password) throw new ForbiddenException('Incorrect password')
        if(user.category.id != team.leader.category.id) throw new ForbiddenException('You re not in the same category as the leader team')
        
        const maxUsers = await this.configService.getNumberFromKey('ctf.players_max_per_team')
        if(team.users.length >= maxUsers) throw new ForbiddenException('This team is complete')
        
        user.team = team
        user.save()
        return true
    }

    async joinTeamWithSecret (user: User, secret: string) {
        const team = await this.repository.findOneBy({ secretHash: secret })
        if (!team) throw new ForbiddenException('Secret is not recognize')
        return await this.joinTeam(user, team.name, team.password)
    }

}
