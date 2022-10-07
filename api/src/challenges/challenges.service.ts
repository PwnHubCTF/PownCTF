import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigsService } from 'src/configs/configs.service';
import { SubmissionsService } from 'src/submissions/submissions.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Challenge } from './entities/challenge.entity';

@Injectable()
export class ChallengesService {

  constructor(
    @InjectRepository(Challenge) protected readonly repository: Repository<Challenge>,
    @Inject(forwardRef(() => SubmissionsService)) protected readonly submissionsService: SubmissionsService,
    protected readonly configsService: ConfigsService,
  ) { }

  async findOne (id: string) {
    let challenge = await this.repository.findOne({ where: { id }, cache: 5000 })
    if (!challenge) throw new NotFoundException('Challenge not found')
    return challenge
  }

  async findForUser (user: User) {
    // REAL QUERY ?
    const challenges = await this.repository.find({ select: { 'author': true, 'category': true, 'description': true, 'difficulty': true, 'id': true }, relations: { submissions: true }, cache: 5000 })
    for (const challenge of challenges) {
      const solved = await this.checkIfSolved(user, challenge)
      challenge.solved = solved
    }
    return challenges
  }

  async checkIfSolved (user: User, challenge: Challenge) {
    const isTeamMode = await this.configsService.getValueFromKey('ctf.team_mode')
    if (isTeamMode === 'true') {
      for (const teammate of user.team.users) {
        const valid = await this.submissionsService.checkIfChallengeIsValidateByUser(teammate, challenge)
        if (valid) return valid
      }
    } else {
      const valid = await this.submissionsService.checkIfChallengeIsValidateByUser(user, challenge)
      if (valid) return valid
    }

    return false
  }

  create (createChallengeDto: CreateChallengeDto) {
    return 'This action adds a new challenge';
  }

  findAll () {
    return `This action returns all challenges`;
  }

  update (id: number, updateChallengeDto: UpdateChallengeDto) {
    return `This action updates a #${id} challenge`;
  }

  remove (id: number) {
    return `This action removes a #${id} challenge`;
  }
}
