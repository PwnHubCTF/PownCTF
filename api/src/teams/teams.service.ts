import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { CategoriesService } from 'src/categories/categories.service';
import { ConfigsService } from 'src/configs/configs.service';
import { EventsService } from 'src/events/events.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamsService {
    constructor(@InjectRepository(Team) protected readonly repository: Repository<Team>,
        private usersService: UsersService,
        private configService: ConfigsService,
        private categoriesService: CategoriesService,
        private eventsService: EventsService,
    ) {}

    async getForUser (user: User) {
        if (user.team) {
            const team = await this.repository.findOne({ where: { id: user.team.id }, relations: ['leader', 'users'] })
            delete team.leader.password
            delete team.leader.points
            delete team.leader.role
            delete team.leader.creation
            delete team.leader.email

            team.users = team.users.map(u => ({ id: u.id, pseudo: u.pseudo })) as any
            return team
        }
        return null
    }

    async update (id: string, updateDto: UpdateTeamDto) {
        if(updateDto.open !== false && updateDto.open !== true) throw new ForbiddenException('open parameter must be a boolean')
        await this.repository.update(id, {
            open: updateDto.open
        })
    }

    async updateAdmin (id: string, updateDto: UpdateTeamDto) {
        await this.repository.update(id, updateDto)
    }

    async findOneReduced (id: string) {
        let team = await this.repository.findOne({ where: { id }, select: ['id', 'name'], relations: ['users'] })
        if (!team) throw new NotFoundException('Team not found')

        team.users = team.users.map(u => ({ id: u.id, pseudo: u.pseudo, points: u.points })).sort((a, b) => b.points - a.points) as any
        return team
    }

    async getTop10Submissions (categoryId: string = null) {
        const teams = await this.getAllReducedInfos(12, 0, categoryId)
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
        if (limit < 0 || page < 0 || isNaN(limit) || isNaN(page)) throw new ForbiddenException('Value error')


        let categoryFilter = ""
        if (categoryId) {
            const category = await this.categoriesService.findOne(categoryId)
            if (!category) throw new ForbiddenException('Category not found')
            categoryFilter = `WHERE user.categoryId = '${category.id}'`
        }

        const count = (await this.repository.query(`
        SELECT SUM(a.points) as points, a.pseudo, a.id FROM
            (SELECT user.points, team.name as pseudo, team.id FROM team INNER JOIN user ON user.teamId = team.id INNER JOIN submission ON submission.userId = user.id AND submission.isValid = 1 ${categoryFilter} GROUP BY user.id ORDER BY user.points DESC, max(submission.creation) ASC) a
            GROUP BY a.id
        `)).length
        const teams = await this.repository.query(`
        SELECT @r := @r+1 as rank, 
           z.* 
        FROM(
            SELECT SUM(a.points) as points, a.pseudo, a.id FROM
            (SELECT user.points, team.name as pseudo, team.id FROM team INNER JOIN user ON user.teamId = team.id INNER JOIN submission ON submission.userId = user.id AND submission.isValid = 1 ${categoryFilter} GROUP BY user.id ORDER BY user.points DESC, max(submission.creation) ASC) a
            GROUP BY a.id
            ORDER BY points DESC
            LIMIT ${page * limit},${limit}
         )z, 
        (SELECT @r:=${limit * page})y
        `)

        return {
            data: teams, count
        }
    }

    async getAllList (limit: number, page: number, categoryId: string = null) {
        if (limit > 10000) throw new ForbiddenException('Invalid limit')
        if (page > 10000) throw new ForbiddenException('Invalid page')
        if (limit < 0 || page < 0 || isNaN(limit) || isNaN(page)) throw new ForbiddenException('Value error')

        let categoryFilter = ""
        if (categoryId) {
            const category = await this.categoriesService.findOne(categoryId)
            if (!category) throw new ForbiddenException('Category not found')
            categoryFilter = `WHERE user.categoryId = '${category.id}'`
        }

        let limitFilter = ""
        if (limit != 0) {
            limitFilter = `LIMIT ${page * limit},${limit}`
        }
        const count = (await this.repository.query(`
        SELECT team.id, team.name,COUNT(*) as players FROM team INNER JOIN user ON user.teamId = team.id ${categoryFilter} GROUP BY team.id
        `)).length
        const teams = await this.repository.query(`
        SELECT team.id, team.name,COUNT(*) as players FROM team INNER JOIN user ON user.teamId = team.id ${categoryFilter} GROUP BY team.id
            ORDER BY team.creation ASC
        ${limitFilter}
        `)

        return {
            data: teams, count
        }
    }

    async all (limit, page, categoryId?: string) {
        if (limit > 10000) throw new ForbiddenException('Invalid limit')
        if (page > 10000) throw new ForbiddenException('Invalid page')

        let categoryFilter = ""
        if (categoryId) {
            const category = await this.categoriesService.findOne(categoryId)
            if (!category) throw new ForbiddenException('Category not found')
            categoryFilter = `WHERE user.categoryId = '${category.id}'`
        }

        let limitFilter = ""
        if (limit != 0) {
            limitFilter = `LIMIT ${page * limit},${limit}`
        }
        const count = (await this.repository.query(`
        SELECT team.id, team.name,COUNT(*) as players FROM team INNER JOIN user ON user.teamId = team.id ${categoryFilter} GROUP BY team.id
        `)).length
        const teams = await this.repository.query(`
        SELECT team.id, team.name,COUNT(*) as players FROM team INNER JOIN user ON user.teamId = team.id ${categoryFilter} GROUP BY team.id
            ORDER BY team.creation ASC
        ${limitFilter}
        `)

        return {
            data: teams, count
        }
    }

    async remove (id: string) {
        return this.repository.delete(id)
    }

    async leave(user: User) {
        if (!user.team) throw new ForbiddenException(`You're not in a team`)
        const team = await this.repository.findOne({ where: { id: user.team.id }, relations: ['users', 'leader'] })
        if (team.leader.id == user.id) {
            throw new ForbiddenException(`You're the leader. Ask an admin if you want to disband your team`)
        } else {
          user.team = null
        }
        await user.save()
        return true
    }

    async kickPlayer(user: User, userId: string) {
        if (!user.team) throw new ForbiddenException(`You're not in a team`)
        if (user.id === userId) throw new ForbiddenException(`You can't kick yourself`)
        const team = await this.repository.findOne({ where: { id: user.team.id }, relations: ['users', 'leader'] })
        if(team.leader.id !== user.id) throw new ForbiddenException(`You're not the leader of the team`)
        const playerToKick = team.users.find(u => u.id === userId)
        if(!playerToKick) throw new ForbiddenException(`This player is not in your team`)
        playerToKick.team = null
        playerToKick.save()
        return true
    }

    async createTeam (user: User, createDto: CreateTeamDto) {
        if (user.team) throw new ForbiddenException('You already have a team')
        if (createDto.name.replace(/[^0-9a-zA-Z_':. \/-]/g, "") != createDto.name) throw new ForbiddenException(`Team name must only contain alphanumeric characters, spaces or . _ ' : / -`)
        const secretHash = randomUUID()
        try {
            await this.repository.save({ name: createDto.name, password: hashPassword(createDto.password), leader: user, secretHash: secretHash })
        } catch (error) {
            throw new ForbiddenException('This team name already exists')
        } return await this.joinTeam(user, createDto.name, createDto.password)
    }
    /**
     * Get open team, with enough room for another player
     * @returns Teams
     */
    async getOpenTeams (limit: number, page: number, categoryId?: string) {
        if (limit > 10000) throw new ForbiddenException('Invalid limit')
        if (page > 10000) throw new ForbiddenException('Invalid page')
        if (limit < 0 || page < 0 || isNaN(limit) || isNaN(page)) throw new ForbiddenException('Value error')

        let categoryFilter = ""
        if (categoryId) {
            const category = await this.categoriesService.findOne(categoryId)
            if (!category) throw new ForbiddenException('Category not found')
            categoryFilter = `AND user.categoryId = '${category.id}'`
        }

        const maxUsers = await this.configService.getNumberFromKey('ctf.players_max_per_team')

        const count = (await this.repository.query(`
        SELECT team.id FROM team 
        INNER JOIN user ON user.teamId = team.id
        WHERE team.open = 1
        ${categoryFilter}
        GROUP BY team.id
        HAVING COUNT(*) < ${maxUsers}
        `)).length

        const teams = await this.repository.query(`
        SELECT team.id, team.name, COUNT(*) as players FROM team 
        INNER JOIN user ON user.teamId = team.id 
        WHERE team.open = 1
        ${categoryFilter}
        GROUP BY team.id
        HAVING COUNT(*) < ${maxUsers}
        ORDER BY COUNT(*) DESC
        LIMIT ${page * limit},${limit}
        `)

        return {
            data: teams, count
        }
    }

    async joinTeam (user: User, teamName: string, password: string, direct: boolean = false) {
        if (user.team) throw new ForbiddenException('You already have a team')

        const team = await this.repository.findOne({ where: { name: teamName }, relations: ['users', 'leader', 'leader.category'] })

        if (!team) throw new ForbiddenException('Team does not exists')
        if (!direct && !team.open && team.password !== hashPassword(password)) throw new ForbiddenException('Incorrect password')
        if (user.category && user.category.id != team.leader.category.id) throw new ForbiddenException('You re not in the same category as the leader team')

        const maxUsers = await this.configService.getNumberFromKey('ctf.players_max_per_team')
        if (team.users.length >= maxUsers) throw new ForbiddenException('This team is complete')

        user.team = team
        await user.save()
        this.eventsService.updateSocketTeamId(user.id, user.team.id)
        return true
    }

    async joinTeamWithSecret (user: User, secret: string) {
        const team = await this.getFromSecret(secret)
        if (!team) throw new ForbiddenException('Secret is not recognize')
        return await this.joinTeam(user, team.name, team.password, true)
    }

    async getFromSecret (secret) {
        return await this.repository.findOneBy({ secretHash: secret })
    }

    async get (id) {
        const team = await this.repository.findOne({ where: { id }, relations: ['users', 'leader'] })
        if (!team) throw new NotFoundException('Team not found')

        team.users = team.users.map(u => ({ id: u.id, pseudo: u.pseudo, points: u.points })).sort((a, b) => b.points - a.points) as any
        return team
    }

}


function hashPassword(password) {
    return require('crypto').createHash('sha256').update(password, 'utf8').digest('hex');
  }