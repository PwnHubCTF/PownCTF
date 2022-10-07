import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigsService } from 'src/configs/configs.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Challenge } from './entities/challenge.entity';
import { Submission } from './entities/submission.entity';

@Injectable()
export class SubmissionsService {

  constructor(
    @InjectRepository(Submission) protected readonly submissionRepository: Repository<Submission>,
    protected readonly challengesService: ChallengesService,
  ) {

  }

  async submit (user: User, challengeId: string, flag: string) {
    const challenge = await this.challengesService.findOne(challengeId)
    this.submissionRepository.save({
      flag,
      challenge,
      user
    })
  }

  async findForUser (user: User) {
    return await this.submissionRepository.createQueryBuilder()
      .select('id, flag')
      .andWhere("userId = :userId", { userId: user.id })
      .execute()
  }

  async findAll () {
    return await this.submissionRepository.find()
  }

  async findAllForUserAndChallenge (user: User, challengeId: string) {
    const challenge = await this.challengesService.findOne(challengeId)
    return await this.submissionRepository.createQueryBuilder()
      .select('creation, flag')
      .where("challengeId = :challengeId", { challengeId: challenge.id })
      .andWhere("userId = :userId", { userId: user.id })
      .execute()
  }

  async checkIfChallengeIsValidateByUser (user: User, challengeId: string) {
    const challenge = await this.challengesService.findOne(challengeId)

    return await this.submissionRepository.query(
      `SELECT submission.creation FROM submission INNER JOIN challenge ON submission.flag = challenge.flag WHERE submission.userId = '${user.id}' AND challenge.id = ${challenge.id}`
    )
  }

  async findValidsForUser (user: User) {
    return await this.submissionRepository.query(
      `SELECT submission.challengeId,submission.creation FROM submission INNER JOIN challenge ON submission.flag = challenge.flag WHERE submission.userId = '${user.id}' AND challenge.id = submission.challengeId`
    )
  }

}
