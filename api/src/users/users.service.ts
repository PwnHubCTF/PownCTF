import { ConflictException, ForbiddenException, HttpException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly categoriesService: CategoriesService
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
      user.save()
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


  async all (limit, page) {
    return this.userRepository.find({
      take: limit,
      skip: page,
    });
  }

  async getTop10Submissions () {
    const users = await this.userRepository.createQueryBuilder()
      .select('id')
      .take(10)
      .orderBy('points', 'DESC')
      .cache(true)
      .execute()

    return await this.userRepository.query(`
    SELECT submission.creation as time, challenge.points, challenge.name, user.pseudo as team
    FROM submission 
    INNER JOIN challenge ON challenge.id = submission.challengeId 
    INNER JOIN user ON submission.userId = user.id 
    AND user.id in ('${users.map(u => u.id).join("', '")}') 
    ORDER BY submission.creation
    `)

  }

  async getAllReducedInfos (limit, page) {
    if(limit < 0 || page < 0) throw new ForbiddenException('Value error')
    const count = await this.userRepository.count()
    const users = await this.userRepository.query(`
    SELECT @r := @r+1 as rank, 
       z.* 
    FROM(SELECT id,pseudo,points FROM user ORDER BY points DESC LIMIT ${limit * page},${limit})z, 
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
    if(user.role == Role.Admin) throw new ForbiddenException("Can't change the role of admin user")
    if(payload.role < 1 || payload.role >= 3) throw new ForbiddenException("Role not found")
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
    if(payload.pseudo.replace(/\W/g, "") != payload.pseudo) throw new ForbiddenException('Pseudo must only contain alphanumeric characters')
    if(payload.pseudo.length > 26) throw new ForbiddenException('Pseudo length must be <= 26')
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