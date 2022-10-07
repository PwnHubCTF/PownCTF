import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigsService } from 'src/configs/configs.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Challenge } from './entities/challenge.entity';

@Injectable()
export class ChallengesService {

  constructor(
    @InjectRepository(Challenge) protected readonly repository: Repository<Challenge>,
    protected readonly configsService: ConfigsService
  ) { }

  findForUser (user: User) {
    throw new Error('Method not implemented.');
  }

  async checkIfSolved (user: User, challenge: Challenge) {
    const isTeamMode = await this.configsService.getValueFromKey('ctf.team_mode')
    if (isTeamMode) {

    } else {

    }
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
