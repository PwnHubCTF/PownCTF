import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserPayload } from 'src/auth/dto/create-user.payload';
import { Repository } from 'typeorm';
import { ChangeRolePayload } from './dto/change-role.payload';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
      ) { }

      async get (id: string) {
        return this.userRepository.findOne({where: {id: id}});
      }

      async getFromEmail (email: string) {
        return this.userRepository.findOne({where: {email: email}});
      }
    
      public all () {
        return this.userRepository.find();
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
    
      async create (payload: CreateUserPayload) {
        return await this.userRepository.save(this.userRepository.create(payload));
      }
}