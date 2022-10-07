import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Challenge } from './entities/challenge.entity';

@Injectable()
export class ChallengesService {

  constructor(@InjectRepository(Challenge) protected readonly repository: Repository<Challenge>) { }

  findForUser (user: User) {
    throw new Error('Method not implemented.');
  }

  create (createChallengeDto: CreateChallengeDto) {
    return 'This action adds a new challenge';
  }

  findAll () {
    return `This action returns all challenges`;
  }

  findOne (id: number) {
    return `This action returns a #${id} challenge`;
  }

  update (id: number, updateChallengeDto: UpdateChallengeDto) {
    return `This action updates a #${id} challenge`;
  }

  remove (id: number) {
    return `This action removes a #${id} challenge`;
  }
}
