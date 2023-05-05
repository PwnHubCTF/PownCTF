import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserPayload } from 'src/auth/dto/create-user.payload';
import { Role } from 'src/auth/role.enum';
import { CategoriesService } from 'src/categories/categories.service';
import { Like, Repository } from 'typeorm';
import { ChangeRolePayload } from './dto/change-role.payload';
import { User } from './entities/user.entity';
import { ResetToken } from 'src/auth/reset-token.entity';
import { MailService } from 'src/mail/mail.service';
import { TeamsService } from 'src/teams/teams.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly categoriesService: CategoriesService,
    private readonly mailService: MailService,

  ) { }

  async getReducedInfos(id: string) {
    let users = await this.userRepository.createQueryBuilder()
      .select('id,pseudo,role,categoryId,teamId')
      .where({ id })
      .cache(true)
      .execute()
    return users[0]
  }

  async get(id: string) {
    return this.userRepository.findOne({ where: { id }, relations: ['team', 'category'], cache: true });
  }

  async findByEmail(email: any) {
    return await this.userRepository.findOneBy({ email });
  }

  async update(id: string, updateDto: any) {
    return await this.userRepository.update(id, updateDto)
  }

  async delete(id: string) {
    const user = await this.get(id)
    if (!user) throw new ForbiddenException('User not found')
    try {
      return await user.remove()
    } catch (error) {
      throw new ForbiddenException("Cannot delete this user (try to remove his flags)")
    }
  }

  async getFromEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }
  async getFromPseudo(pseudo: string) {
    return this.userRepository.findOneBy({ pseudo });
  }

  async resetMail(token: ResetToken) {
    const result =  await this.mailService.sendResetPassword(token.user.email, token.token)
    if(!result) throw new ForbiddenException('Unable to send mail')
    return { message: 'mail sent' }
  }

  async changePassword(user: User, password: string) {
    user.password = hashPassword(password)
    return await user.save()
  }

  async kickFromCategory(id: string) {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['team', 'category'], cache: true });
    if (!user) throw new ForbiddenException(`User not found`)
    if (!user.category) throw new ForbiddenException(`User is not in a category`)
    if (user.team) throw new ForbiddenException(`Can't remove a category from a user in a team`)
    user.category = null
    return await user.save()
  }

  async kickFromTeam(id: string) {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['team', 'team.leader', 'team.users'], cache: true });
    if (!user) throw new ForbiddenException(`User not found`)
    if (!user.team) throw new ForbiddenException(`User is not in a team`)
    if (user.team.leader.id == id) {
      if(user.team.users.length === 1){
        await user.team.remove()
        user.team = null
      } else {
        throw new ForbiddenException(`You need to kick other users before kicking the leader`)
      }
    } else {
      user.team = null
    }
    return await user.save()
  }

  async updatePlayersPoints() {
    const users = await this.userRepository.find()
    for (const user of users) {
      let points = await this.userRepository.query(
        `SELECT SUM(challenge.points) as points FROM submission INNER JOIN challenge ON submission.challengeId = challenge.id INNER JOIN user ON user.id = submission.userId WHERE submission.isValid = 1 AND user.id = '${user.id}'`
      )
      user.points = points[0].points ? points[0].points : 0
      await user.save()
    }
  }

  async getOneReduced(id: string) {
    let user = await this.userRepository.findOne({ where: { id }, relations: ['team', 'category'], cache: true });
    if (!user) throw new NotFoundException('User not found')
    if (user.team) {
      delete user.team.password
      delete user.team.secretHash
      delete user.team.users
    }
    if (user.category)
      delete user.category.users

    delete user.password
    delete user.email

    if (user.spaceship) {
      user.pseudo = `🚀 ${user.pseudo}`
    }

    return user
  }


  async all(limit, page, categoryId?: string, search?: string) {
    if (limit > 10000) throw new ForbiddenException('Invalid limit')
    if (page > 10000) throw new ForbiddenException('Invalid page')
    if (limit < 0 || page < 0 || isNaN(limit) || isNaN(page)) throw new ForbiddenException('Value error')
    let filters: any = {}

    if (categoryId) {
      const category = await this.categoriesService.findOne(categoryId)
      if (!category) throw new ForbiddenException('Category not found')
      filters.category = {
        id: categoryId
      }
    }

    if (search) {
      filters = [{ pseudo: Like(`%${search}%`) }, { email: Like(`%${search}%`) }]
      if (categoryId) {
        filters = [{
          category: {
            id: categoryId
          }, pseudo: Like(`%${search}%`)
        }, {
          category: {
            id: categoryId
          }, email: Like(`%${search}%`)
        }]
      }
    }

    const count = await this.userRepository.count({ where: filters })
    const users = await this.userRepository.find({
      take: limit,
      skip: page * limit,
      where: filters,
      order: {
        creation: 'ASC'
      },
      relations: ['team', 'category']
    });

    return {
      data: users, count
    }
  }

  async allUsers(limit, page, categoryId?: string) {
    if (limit > 10000) throw new ForbiddenException('Invalid limit')
    if (page > 10000) throw new ForbiddenException('Invalid page')
    if (limit < 0 || page < 0 || isNaN(limit) || isNaN(page)) throw new ForbiddenException('Value error')
    let filters: any = {
      role: 1
    }

    if (categoryId) {
      const category = await this.categoriesService.findOne(categoryId)
      if (!category) throw new ForbiddenException('Category not found')
      filters.category = {
        id: categoryId
      }
    }

    const count = await this.userRepository.count({ where: filters })
    const users = await this.userRepository.find({
      take: limit,
      select: ['id', 'pseudo', 'creation'],
      skip: page * limit,
      where: filters,
      order: {
        creation: 'ASC'
      },
      relations: ['category', 'team']
    });

    for(const u of users){
      if(!u.team) continue
      delete u.team.creation
      delete u.team.open
      delete u.team.password
      delete u.team.secretHash
    }

    return {
      data: users, count
    }
  }

  async getTop10Submissions(categoryId: string = null) {
    const users = await this.getAllScoreboard(10, 0)

    let categoryFilter = ""
    if (categoryId) {
      const category = await this.categoriesService.findOne(categoryId)
      if (!category) throw new ForbiddenException('Category not found')
      categoryFilter = `AND user.categoryId = '${category.id}'`
    }

    return await this.userRepository.query(`
    SELECT submission.creation as time, challenge.points, challenge.name, user.pseudo as team
    FROM submission 
    INNER JOIN challenge ON challenge.id = submission.challengeId 
    INNER JOIN user ON submission.userId = user.id 
    AND user.id in ('${users.data.map(u => u.id).join("', '")}') 
    ${categoryFilter}
    AND submission.isValid = 1
    ORDER BY submission.creation
    `)
  }

  async getAllScoreboard(limit, page, categoryId: string = null) {
    if (limit > 10000) throw new ForbiddenException('Invalid limit')
    if (page > 10000) throw new ForbiddenException('Invalid page')
    if (limit < 0 || page < 0 || isNaN(limit) || isNaN(page)) throw new ForbiddenException('Value error')

    let categoryFilter = ""
    let filters: any = {}
    if (categoryId) {
      const category = await this.categoriesService.findOne(categoryId)
      if (!category) throw new ForbiddenException('Category not found')
      categoryFilter = `WHERE user.categoryId = '${category.id}'`
      filters.category = {
        id: categoryId
      }
    }

    const count = (await this.userRepository.query(`SELECT user.id,user.pseudo,user.points FROM user
    INNER JOIN submission
    ON submission.userId = user.id AND submission.isValid = 1
    ${categoryFilter}
    GROUP BY submission.userId`)).length
    const users = await this.userRepository.query(`
    SELECT @r := @r+1 as rank, 
       z.* 
    FROM(SELECT user.id,user.pseudo,user.points FROM user
    INNER JOIN submission
    ON submission.userId = user.id AND submission.isValid = 1
    ${categoryFilter}
    GROUP BY submission.userId
    ORDER BY user.points DESC, MAX(submission.creation) ASC
    LIMIT ${limit * page},${limit})z, 
    (SELECT @r:=${limit * page})y
    `)

    return {
      data: users, count
    }
  }

  // async getAllInfos (id: string) {
  //   let user = await this.userRepository.findOne({ where: { id }, relations: ['success'] });
  //   if (!user) {
  //     throw new NotFoundException('User not found')
  //   }
  //   return user
  // }

  async changeRank(id: string, payload: ChangeRolePayload) {
    const user = await this.get(id)
    if (!user) throw new ForbiddenException("User not found")
    if (user.role == Role.Admin) throw new ForbiddenException("Can't change the role of admin user")
    if (payload.role < 1 || payload.role >= 3) throw new ForbiddenException("Role not found")
    user.role = payload.role
    user.save()
    return user
  }

  async addSpaceship(id: string, spaceship: boolean) {
    const user = await this.get(id)
    if (!user) throw new ForbiddenException("User not found")
    user.spaceship = !!spaceship
    user.save()
    return user
  }

  // async setCategoryToUser (userId: any, categoryId: string) {
  //   let user = await this.get(userId)
  //   if (!user) throw new ForbiddenException("User not found")
  //   let category = await this.categoriesService.findOne(categoryId)
  //   if (!category) throw new ForbiddenException("Category not found")

  //   user.category = category
  //   user.save()
  //   return 'Moved in category ' + category.name
  // }

  async create(payload: CreateUserPayload) {
    payload.pseudo = String(payload.pseudo)
    payload.email = String(payload.email)
    payload.password = String(payload.password)

    if (payload.pseudo.replace(/\W/g, "") != payload.pseudo) throw new ForbiddenException('Pseudo must only contain alphanumeric characters')
    if (payload.pseudo.length > 26) throw new ForbiddenException('Pseudo length must be <= 26')
    let alreadyExists = await this.getFromEmail(payload.email)
    if (alreadyExists) throw new ConflictException('Email already used')
    alreadyExists = await this.getFromPseudo(payload.pseudo)
    if (alreadyExists) throw new ConflictException('Pseudo already used')
    const hashed = hashPassword(payload.password)
    let user = {
      pseudo: payload.pseudo,
      password: hashed,
      email: payload.email,
      role: 1
    }

    let userCount = await this.userRepository.count()
    if (userCount === 0) user.role = 3

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw new UnprocessableEntityException('There is an error with your payload')
    }
  }
}

function hashPassword(password) {
  return require('crypto').createHash('sha256').update(password, 'utf8').digest('hex');
}