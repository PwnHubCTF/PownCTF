import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserPayload } from 'src/auth/dto/create-user.payload';
import { Role } from 'src/auth/role.enum';
import { CategoriesService } from 'src/categories/categories.service';
import { Repository } from 'typeorm';
import { ChangeRolePayload } from './dto/change-role.payload';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly categoriesService: CategoriesService,
  ) { }

  async getReducedInfos (id: string) {
    let users = await this.userRepository.createQueryBuilder()
      .select('id,pseudo,role,categoryId,teamId')
      .where({ id })
      .cache(true)
      .execute()
    return users[0]
  }

  async get (id: string) {
    return this.userRepository.findOne({ where: { id }, relations: ['team', 'category'], cache: true });
  }

  async getFromEmail (email: string) {
    return this.userRepository.findOneBy({ email });
  }
  async getFromPseudo (pseudo: string) {
    return this.userRepository.findOneBy({ pseudo });
  }

  async updatePlayersPoints () {
    const users = await this.userRepository.find()
    for (const user of users) {
      let points = await this.userRepository.query(
        `SELECT SUM(challenge.points) as points FROM submission INNER JOIN challenge ON submission.challengeId = challenge.id INNER JOIN user ON user.id = submission.userId WHERE submission.isValid = 1 AND user.id = '${user.id}'`
      )
      user.points = points[0].points ? points[0].points : 0
      await user.save()
    }
  }

  async getOneReduced (id: string) {
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

    return user
  }


  async all (limit, page, categoryId?: string) {
    if (limit > 10000) throw new ForbiddenException('Invalid limit')
    if (page > 10000) throw new ForbiddenException('Invalid page')
    let filters: any = {}
    if(categoryId) {
      const category = await this.categoriesService.findOne(categoryId)
      if(!category) throw new ForbiddenException('Category not found')
      filters.category = {
        id: categoryId
      }
    }
    
    const count = await this.userRepository.count({where: filters})
    const users = await this.userRepository.find({
      take: limit,
      skip: page*limit,
      where: filters
    });

    return {
      data: users, count
    }
  }

  async getTop10Submissions (categoryId: string = null) {
    const users = await this.getAllReducedInfos(10, 0)

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
    ORDER BY submission.creation
    `)
  }

  async getAllReducedInfos (limit, page, categoryId: string = null) {
    if (limit > 10000) throw new ForbiddenException('Invalid limit')
    if (page > 10000) throw new ForbiddenException('Invalid page')
    if (limit < 0 || page < 0) throw new ForbiddenException('Value error')

    let categoryFilter = ""
    if (categoryId) {
      const category = await this.categoriesService.findOne(categoryId)
      if (!category) throw new ForbiddenException('Category not found')
      categoryFilter = `WHERE user.categoryId = '${category.id}'`
    }

    const count = await this.userRepository.count()
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

  async changeRank (id: string, payload: ChangeRolePayload) {
    const user = await this.get(id)
    if (!user) throw new ForbiddenException("User not found")
    if (user.role == Role.Admin) throw new ForbiddenException("Can't change the role of admin user")
    if (payload.role < 1 || payload.role >= 3) throw new ForbiddenException("Role not found")
    user.role = payload.role
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

  async create (payload: CreateUserPayload) {
    if (payload.pseudo.replace(/\W/g, "") != payload.pseudo) throw new ForbiddenException('Pseudo must only contain alphanumeric characters')
    if (payload.pseudo.length > 26) throw new ForbiddenException('Pseudo length must be <= 26')
    let alreadyExists = await this.getFromEmail(payload.email)
    if (alreadyExists) throw new ConflictException('Email already used')
    alreadyExists = await this.getFromPseudo(payload.pseudo)
    if (alreadyExists) throw new ConflictException('Pseudo already used')
    const hashed = require('crypto').createHash('sha256').update(payload.password, 'utf8').digest('hex');
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