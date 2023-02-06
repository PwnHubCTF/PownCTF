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
import { Team } from 'src/teams/entities/team.entity';
import { TeamsService } from 'src/teams/teams.service';

@Injectable()
export class SubmissionsService {

  constructor(
    @InjectRepository(Submission) protected readonly submissionRepository: Repository<Submission>,
    @Inject(forwardRef(() => ChallengesService)) protected readonly challengesService: ChallengesService,
    protected readonly configsService: ConfigsService,
    protected readonly usersService: UsersService,
    protected readonly teamsService: TeamsService,
    private readonly httpService: HttpService
  ) {
  }


  async getScoreboard () {
    const teamMode = await this.configsService.getBooleanFromKey('ctf.team_mode')
    if (!teamMode)
      return await this.usersService.getTop10Submissions()
    return await this.teamsService.getTop10Submissions()
  }

  async submit (user: User, challengeId: string, flag: string) {
    const challenge = await this.challengesService.findOne(challengeId)
    const solved = await this.challengesService.checkIfSolved(user, challenge)
    if (solved) return 'solved'

    let isValid = challenge.flag === flag

    if (challenge.signedFlag) {
      const flagSigned = await this.challengesService.signFlagFromChallengeAndUser(challengeId, user.id)
      isValid = flagSigned === flag
    }

    await this.submissionRepository.save({
      flag,
      challenge,
      user,
      isValid
    })

    if (isValid) {
      if(challenge.instance == 'multiple') this.challengesService.stop(challenge.id, user)
      const nbrOfSolves = await this.findValidsForChallenge(challengeId)
      if (nbrOfSolves.length === 1) {
        this.sendDiscordFirstblood({ challenge: challenge.name, user: user.pseudo })
      }
      this.challengesService.updateChallengePoints(challenge)
      this.usersService.updatePlayersPoints()
      return 'correct'
    } else {
      return 'incorrect'
    }
  }

  async findValidsByUser (userId: string) {
    let user = await this.usersService.get(userId)
    if (!user) throw new NotFoundException('User not found')

    return await this.submissionRepository.query(
      `SELECT submission.creation, challenge.points, challenge.id as challengeId, challenge.name, user.pseudo, user.id as userId FROM submission
      INNER JOIN challenge 
      ON challenge.id = submission.challengeId
      INNER JOIN user 
      ON user.id = submission.userId
      WHERE submission.isValid = 1
      AND submission.userId = '${user.id}'
      ORDER BY submission.creation ASC
      `
    )
  }

  async findAll (limit, page) {
    return await this.submissionRepository.find({
      take: limit, skip: page
    })
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
        WHERE submission.userId = '${user.id}'
        AND submission.isValid = 1
        AND submission.challengeId = '${challenge.id}'`
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
        WHERE submission.userId = '${user.id}'
        AND submission.isValid = 1`
    )

    // return user.submissions.filter(s => s.isValid)
  }

  /**
 * Get all valid submission for a team
 * @returns list of submissions
 */
  async findValidsForTeam (teamId: string) {
    const team = await this.teamsService.findOneReduced(teamId)
    if (!team) throw new NotFoundException('Team not found')
    let userIds = []
    for (const user of team.users) {
      userIds.push(`submission.userId = '${user.id}'`)
    }

    return await this.submissionRepository.query(
      `SELECT submission.challengeId,submission.creation,challenge.points FROM submission
          INNER JOIN challenge
          ON challenge.id = submission.challengeId
          AND submission.isValid = 1
          WHERE ${userIds.join(' OR ')}`
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
      `SELECT submission.userId,submission.creation FROM submission
      INNER JOIN challenge
      ON challenge.id = submission.challengeId
      WHERE challenge.id = '${challenge.id}'
      AND submission.isValid = 1`
    )
  }

  async sendDiscordFirstblood (firstBloodData: FirstBloodData) {
    const hook = await this.configsService.getValueFromKey('webhook.discord_first_blood')
    if (!hook) return
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