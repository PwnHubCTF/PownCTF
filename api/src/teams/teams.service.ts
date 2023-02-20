import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, createHmac, randomUUID } from 'crypto';
import { CategoriesService } from 'src/categories/categories.service';
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
        private categoriesService: CategoriesService,
    ) {
        super(repository)
    }

    async getForUser (user: User) {
        return user.team
    }

    async findOneReduced (id: string) {
        let team = await this.repository.findOne({ where: { id }, select: ['id', 'name'], relations: ['users'], cache: true })
        if (!team) throw new NotFoundException('Team not found')

        team.users = team.users.map(u => ({ id: u.id, pseudo: u.pseudo, points: u.points })).sort((a, b) => b.points - a.points) as any
        return team
    }

    async getTop10Submissions (categoryId: string = null) {
        const teams = await this.getAllReducedInfos(10, 0)
        let categoryFilter = ""
        if (categoryId) {
            const category = await this.categoriesService.findOne(categoryId)
            if (!category) throw new ForbiddenException('Category not found')
            categoryFilter = `AND user.categoryId = '${category.id}'`
        }

        return await this.repository.query(`
        SELECT submission.creation as time, challenge.points, challenge.name, team.name as team FROM submission 
        INNER JOIN challenge ON challenge.id = submission.challengeId 
        INNER JOIN user ON submission.userId = user.id
        INNER JOIN team ON team.id = user.teamId
        WHERE user.teamId in ('${teams.data.map(u => u.id).join("', '")}')
        ${categoryFilter}
        AND submission.isValid = 1
        ORDER BY user.points DESC
        `)
    }

    async getAllReducedInfos (limit: number, page: number, categoryId: string = null) {
        if (limit > 10000) throw new ForbiddenException('Invalid limit')
        if (page > 10000) throw new ForbiddenException('Invalid page')
        if (limit < 0 || page < 0) throw new ForbiddenException('Value error')


        let categoryFilter = ""
        if (categoryId) {
            const category = await this.categoriesService.findOne(categoryId)
            if (!category) throw new ForbiddenException('Category not found')
            categoryFilter = `WHERE user.categoryId = '${category.id}'`
        }

        const count = await this.repository.count()
        const teams = await this.repository.query(`
        SELECT @r := @r+1 as rank, 
           z.* 
        FROM(
            SELECT SUM(a.points) as points, a.pseudo, a.id FROM
            (SELECT user.points, team.name as pseudo, team.id FROM team INNER JOIN user ON user.teamId = team.id INNER JOIN submission ON submission.userId = user.id AND submission.isValid = 1 ${categoryFilter} GROUP BY user.id ORDER BY user.points DESC, max(submission.creation) ASC) a
            GROUP BY a.id
            LIMIT ${page * limit},${limit}
         )z, 
        (SELECT @r:=${limit * page})y
        `)

        return {
            data: teams, count
        }
    }

    async createTeam (user: User, createDto: CreateTeamDto) {
        if (user.team) throw new ForbiddenException('You already have a team')
        if (createDto.name.replace(/^\W/g, "") != createDto.name) throw new ForbiddenException('Team name must only contain alphanumeric characters')
        const secretHash = randomUUID()
        try {
            await this.create({ name: createDto.name, password: createDto.password, leader: user, secretHash: secretHash })
        } catch (error) {
            throw new ForbiddenException('This team name already exists')
        } return await this.joinTeam(user, createDto.name, createDto.password)
    }

    async joinTeam (user: User, teamName: string, password: string) {
        if (user.team) throw new ForbiddenException('You already have a team')

        const team = await this.repository.findOne({ where: { name: teamName }, relations: ['users', 'leader', 'leader.category'] })

        if (!team) throw new ForbiddenException('Team does not exists')
        if (team.password !== password) throw new ForbiddenException('Incorrect password')
        if (user.category && user.category.id != team.leader.category.id) throw new ForbiddenException('You re not in the same category as the leader team')

        const maxUsers = await this.configService.getNumberFromKey('ctf.players_max_per_team')
        if (team.users.length >= maxUsers) throw new ForbiddenException('This team is complete')

        user.team = team
        await user.save()
        return true
    }

    async joinTeamWithSecret (user: User, secret: string) {
        const team = await this.getFromSecret(secret)
        if (!team) throw new ForbiddenException('Secret is not recognize')
        return await this.joinTeam(user, team.name, team.password)
    }

    async getFromSecret (secret) {
        return await this.repository.findOneBy({ secretHash: secret })
    }

}
