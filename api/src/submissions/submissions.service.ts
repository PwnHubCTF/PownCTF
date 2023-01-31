import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChallengesService } from 'src/challenges/challenges.service';
import { Challenge } from 'src/challenges/entities/challenge.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { ConfigsService } from 'src/configs/configs.service';
import { HttpService } from '@nestjs/axios';
import { UsersService } from 'src/users/users.service';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';

@Injectable()
export class SubmissionsService {

  constructor(
    @InjectRepository(Submission) protected readonly submissionRepository: Repository<Submission>,
    @Inject(forwardRef(() => ChallengesService)) protected readonly challengesService: ChallengesService,
    protected readonly configsService: ConfigsService,
    protected readonly usersService: UsersService,
    private readonly httpService: HttpService
  ) {
    // Create view
    this.createScoreboardView()
  }
  createScoreboardView () {
    this.submissionRepository.query('CREATE VIEW scoreboard AS SELECT submission.challengeId,submission.userId,user.pseudo,submission.creation as date FROM submission INNER JOIN challenge ON submission.flag = challenge.flag AND challenge.id = submission.challengeId INNER JOIN user ON user.id = submission.userId').catch(reason => {
      // console.log("Scoreboard view already exists");
    })
  }

  async getScoreboard () {
    return await this.submissionRepository.query('SELECT * FROM scoreboard INNER JOIN challenge_cache ON scoreboard.challengeId = challenge_cache.challengeId')
  }

  async submit (user: User, challengeId: string, flag: string) {
    const challenge = await this.challengesService.findOne(challengeId)
    const solved = await this.challengesService.checkIfSolved(user, challenge)
    if (solved) return 'solved'
    await this.submissionRepository.save({
      flag,
      challenge,
      user,
      isValid: challenge.flag === flag
    })


    if (challenge.flag === flag) {
      const nbrOfSolves = await this.findValidsForChallenge(challengeId)
      if (nbrOfSolves.length === 1) {
        this.sendDiscordFirstblood({ challenge: challenge.name, user: user.pseudo })
      }
      this.challengesService.updateChallengePoints(challenge)
      return 'correct'
    } else {
      return 'incorrect'
    }
  }

  // async findForUser (user: User) {
  //   return await this.submissionRepository.createQueryBuilder()
  //     .select('id, flag')
  //     .andWhere("userId = :userId", { userId: user.id })
  //     .cache(true)
  //     .execute()
  // }

  async findValidsByUser (userId: string) {
    let user = await this.usersService.get(userId)
    if (!user) throw new NotFoundException('User not found')

    return await this.submissionRepository.query(
      `SELECT submission.creation, challenge_cache.points, challenge.id as challengeId, challenge.name, user.pseudo, user.id as userId FROM submission
      INNER JOIN challenge 
      ON challenge.id = submission.challengeId 
      INNER JOIN challenge_cache
      ON challenge_cache.challengeId = challenge.id 
      INNER JOIN user 
      ON user.id = submission.userId
      WHERE submission.isValid = 1
      AND submission.userId = '${user.id}'
      ORDER BY submission.creation ASC
      `
    )
  }

  async findAll () {
    return await this.submissionRepository.find()
  }

  /**  Find all submission by a user on a challenge
   * @warning Cached query. result can be not updated
   * 
   */
  async findAllForUserAndChallenge (user: User, challengeId: string) {
    const challenge = await this.challengesService.findOne(challengeId)
    return await this.submissionRepository.createQueryBuilder()
      .select('creation, flag')
      .where("challengeId = :challengeId", { challengeId: challenge.id })
      .andWhere("userId = :userId", { userId: user.id })
      .cache(true)
      .execute()
  }

  /**
   * @returns the date of solve of a challenge, or false
   */
  async checkIfChallengeIsValidateByUser (user: User, challenge: Challenge) {
    let res = (await this.submissionRepository.query(
      `SELECT submission.creation FROM submission
        INNER JOIN challenge 
        ON submission.flag = challenge.flag 
        AND challenge.id = submission.challengeId 
        WHERE submission.userId = '${user.id}' 
        AND challenge.id = '${challenge.id}'`
    ))

    if (res.length === 1) return res[0].creation
    return false
  }

  /**
   * Get all valid submission for a user
   * @returns list of submissions
   */
  async findValidsForUser (user: User) {
    return await this.submissionRepository.query(
      `SELECT submission.challengeId,submission.creation FROM submission
        INNER JOIN challenge
        ON submission.flag = challenge.flag
        AND challenge.id = submission.challengeId
        WHERE submission.userId = '${user.id}'`
    )

    // return user.submissions.filter(s => s.isValid)
  }

  /**
   * Get valids submission for a challenge
   * @returns list of submission
   */
  async findValidsForChallenge (challengeId: string) {
    const challenge = await this.challengesService.findOne(challengeId)

    return await this.submissionRepository.query(
      `SELECT submission.userId,submission.creation FROM submission INNER JOIN challenge ON submission.flag = challenge.flag AND challenge.id = submission.challengeId WHERE challenge.id = '${challenge.id}'`
    )
  }

  async sendDiscordFirstblood (firstBloodData: FirstBloodData) {
    const hook = await this.configsService.getValueFromKey('webhook.discord_first_blood')
    const data = {
      "embeds": [
        {
          "title": `${firstBloodData.challenge} :first_place:`,
          "description": `Félicitations à **${firstBloodData.user}**, qui flag en premier ${firstBloodData.challenge} !`,
          "color": 16755763
        }
      ]
    }
    await this.httpService.axiosRef.post(hook, data)
  }

}

interface FirstBloodData {
  user: string,
  challenge: string
}