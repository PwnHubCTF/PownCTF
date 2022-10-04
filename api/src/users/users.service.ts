import { ConflictException, ForbiddenException, HttpException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserPayload } from 'src/auth/dto/create-user.payload';
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
      .execute()
    return users[0]
  }

  async get (id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async getFromEmail (email: string) {
    return this.userRepository.findOneBy({ email: email });
  }

  async all () {
    return this.userRepository.find();
  }

  async getAllReducedInfos () {
    return this.userRepository.createQueryBuilder()
      .select('id,pseudo')
      .execute()
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
    if (!user) throw new Error("User not found")
    user.role = payload.role
    user.save()
    return user
  }

  async setCategoryToUser (userId: any, categoryId: string) {
    let user = await this.get(userId)
    if (!user) throw new Error("User not found")
    let category = await this.categoriesService.findOne(categoryId)
    if (!category) throw new Error("Category not found")

    user.category = category
    user.save()
    return 'Moved in category ' + category.name
  }

  async create (payload: CreateUserPayload) {
    let alreadyExists = await this.getFromEmail(payload.email)
    if (alreadyExists) throw new ConflictException('Email already used')

    let userCount = await this.userRepository.count()
    let user = {
      pseudo: payload.pseudo,
      password: payload.password,
      email: payload.email,
      role: 1
    }

    if (userCount === 0) user.role = 3

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw new UnprocessableEntityException('There is an error with your payload')
    }
  }
}