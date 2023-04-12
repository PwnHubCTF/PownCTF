import { HttpService } from '@nestjs/axios';
import { ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { ChallengesService } from 'src/challenges/challenges.service';
import { Challenge } from 'src/challenges/entities/challenge.entity';
import { ConfigsService } from 'src/configs/configs.service';
import { DeployerService } from 'src/deployer/deployer.service';
import { EventsService } from 'src/events/events.service';
import { TeamsService } from 'src/teams/teams.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { AdminValidateDto } from './dto/admin-validate.dto';
import { Submission } from './entities/submission.entity';
import { log } from 'console';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission) protected readonly submissionRepository: Repository<Submission>,
    @Inject(forwardRef(() => ChallengesService)) protected readonly challengesService: ChallengesService,
    protected readonly configsService: ConfigsService,
    protected readonly usersService: UsersService,
    protected readonly teamsService: TeamsService,
    protected readonly deployerService: DeployerService,
    protected readonly eventsService: EventsService,
    private readonly httpService: HttpService,
    private readonly categoriesService: CategoriesService,
  ) {
  }


  async getScoreboard(category: string = null) {
    const teamMode = await this.configsService.getBooleanFromKey('ctf.team_mode')
    if (teamMode) return await this.teamsService.getTop10Submissions(category)
    return await this.usersService.getTop10Submissions(category)
  }


  async adminValidate(payload: AdminValidateDto) {
    const user = await this.usersService.get(payload.userId)
    if (!user) throw new ForbiddenException('User not found')
    const challenge = await this.challengesService.findOne(payload.challengeId)
    if (!user) throw new ForbiddenException('Challenge not found')

    if (await this.checkIfChallengeIsValidateByUser(user, challenge)) throw new ForbiddenException('Challenge already validated')

    await this.submissionRepository.save({
      flag: "Admin validated",
      challenge,
      user,
      isValid: true
    })

    const nbrOfSolves = await this.findAllValidsForChallenge(payload.challengeId)
    if (nbrOfSolves.length === 1) this.sendDiscordFirstblood({ challenge: challenge.name, user: user.pseudo })

    let newPoints = await this.challengesService.updateChallengePoints(challenge)
    await this.usersService.updatePlayersPoints()
    this.eventsService.broadcastEventToUsers('flag', {
      challenge: challenge.name,
      challengeId: challenge.id,
      user: user.pseudo,
      solves: nbrOfSolves.length,
      points: newPoints
    })

    return true
  }

  async adminDelete(payload: AdminValidateDto) {
    const user = await this.usersService.get(payload.userId)
    if (!user) throw new ForbiddenException('User not found')
    const challenge = await this.challengesService.findOne(payload.challengeId)
    if (!user) throw new ForbiddenException('Challenge not found')

    const submission = await this.checkIfChallengeIsValidateByUser(user, challenge)

    if (!submission) throw new ForbiddenException('Challenge is not flagged')

    await submission.remove()
    await this.usersService.updatePlayersPoints()

    return true
  }

  async submit(user: User, challengeId: string, flag: string) {
    if (flag.length > 50) throw new ForbiddenException('Flag too long')
    const challenge = await this.challengesService.findOne(challengeId)
    if (!challenge.flag) throw new ForbiddenException('This challenge is not flaggable')
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
      if (challenge.instance == 'multiple') this.deployerService.stop(challenge.id, user)
      const nbrOfSolves = await this.findAllValidsForChallenge(challengeId)
      if (nbrOfSolves.length === 1) {
        this.sendDiscordFirstblood({ challenge: challenge.name, user: user.pseudo })
      }
      let newPoints = await this.challengesService.updateChallengePoints(challenge)
      await this.usersService.updatePlayersPoints()
      this.eventsService.broadcastEventToUsers('flag', {
        challenge: challenge.name,
        challengeId: challenge.id,
        user: user.pseudo,
        solves: nbrOfSolves.length,
        points: newPoints
      })
      return 'correct'
    } else {
      return 'incorrect'
    }
  }

  /**
   * Can be used by anyone
   * @param userId User
   * @returns Valids submissions for a user
   */
  async findValidsByUser(userId: string) {
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

  /**
   * Admin usage
   */
  async findAll(limit, page) {
    if (page > 10000) throw new ForbiddenException('Invalid page')
    if (limit > 10000) throw new ForbiddenException('Invalid limit')
    const count = await this.submissionRepository.count()
    const submissions = await this.submissionRepository.find({
      take: limit, skip: page * limit, relations: ['user'], order: {
        'creation': 'ASC'
      }
    })
    for(const s of submissions){
      delete s.user.password
      delete s.user.email
      delete s.user.role
      delete s.user.creation
    }
    return { count, data: submissions }
  }

  /**  
   * Find all submission by a user on a challenge
   * @warning Cached query. result can be not updated
   * 
   */
  async findAllForUserAndChallenge(user: User, challengeId: string) {
    const challenge = await this.challengesService.findOne(challengeId)
    return await this.submissionRepository.createQueryBuilder()
      .select('creation, flag')
      .where("challengeId = :challengeId", { challengeId: challenge.id })
      .andWhere("userId = :userId", { userId: user.id })
      .cache(true)
      .execute()
  }


  async getTopUsersForAllChallengeCategory(userCategoryId: string = null) {
    const categories = await this.challengesService.getCategories()
    let scoreboard = {}
    for (const category of categories) {
      scoreboard[category] = await this.getTopUsersForChallengeCategory(category, 3, userCategoryId)
    }
    return scoreboard
  }

  async getTopUsersForChallengeCategory(chalengeCategory: string, limit: number, userCategoryId: string = null) {
    if (limit > 10000) throw new ForbiddenException('Invalid limit')
    const categories = await this.challengesService.getCategories()
    if (!categories.includes(chalengeCategory)) throw new ForbiddenException('Category not found')

    let categoryFilter = ""
    if (userCategoryId) {
      const category = await this.categoriesService.findOne(userCategoryId)
      if (!category) throw new ForbiddenException('Category not found')
      categoryFilter = `AND user.categoryId = '${category.id}'`
    }

    return await this.submissionRepository.query(`
    SELECT @r := @r+1 as rank, 
    z.* 
 FROM(      SELECT user.id, user.pseudo, SUM(challenge.points) as points FROM challenge
 INNER JOIN submission 
 ON challenge.id = submission.challengeId AND submission.isValid = 1
 INNER JOIN user
 ON user.id = submission.userId
 WHERE challenge.category = "${chalengeCategory}"
 ${categoryFilter}
 GROUP BY submission.userId
 ORDER BY points DESC, MAX(submission.creation) ASC
 LIMIT ${limit})z, 
 (SELECT @r:=0)y
    `)
  }

  async getTopTeamsForAllChallengeCategory(userCategoryId: string = null) {
    const categories = await this.challengesService.getCategories()
    let scoreboard = {}
    for (const category of categories) {
      scoreboard[category] = await this.getTopTeamsForChallengeCategory(category, 3, userCategoryId)
    }
    return scoreboard
  }

  async getTopTeamsForChallengeCategory(category: string, limit: number, categoryId: string = null) {
    if (limit > 10000) throw new ForbiddenException('Invalid limit')
    let categories = await this.challengesService.getCategories()
    if (!categories.includes(category)) throw new ForbiddenException('Category not found')

    let categoryFilter = ""
    if (categoryId) {
      const category = await this.categoriesService.findOne(categoryId)
      if (!category) throw new ForbiddenException('Category not found')
      categoryFilter = `AND user.categoryId = '${category.id}'`
    }

    return await this.submissionRepository.query(`
    SELECT @r := @r+1 as rank, 
    z.* 
      FROM(SELECT user.teamId, team.id, team.name as pseudo, SUM(challenge.points) as points FROM challenge
      INNER JOIN submission 
      ON challenge.id = submission.challengeId AND submission.isValid = 1
      INNER JOIN user
      ON user.id = submission.userId
      INNER JOIN team
      ON user.teamId = team.id
      WHERE challenge.category = "${category}"
      ${categoryFilter}
      GROUP BY  user.teamId
      ORDER BY points DESC, MAX(submission.creation) ASC
      LIMIT ${limit})z, 
    (SELECT @r:=0)y
    `)
  }



  /**
   * Used to check if a challenge is solve
   * @returns Submission, or false
   */
  async checkIfChallengeIsValidateByUser(user: User, challenge: Challenge) {
    const submission = await this.submissionRepository.findOneBy({
      isValid: true,
      userId: user.id,
      challengeId: challenge.id
    })
    if (submission) return submission
    return false
  }

  /**
   * Get all valid submission for a user
   * @returns list of submissions
   */
  // async findValidsForUser (user: User) {
  //   return await this.submissionRepository.query(
  //     `SELECT submission.challengeId,submission.creation FROM submission
  //       WHERE submission.userId = '${user.id}'
  //       AND submission.isValid = 1`
  //   )

  // }

  /**
 * Get all valid submission for a team
 * @returns list of submissions
 */
  async findValidsForTeam(teamId: string) {
    const team = await this.teamsService.findOneReduced(teamId)
    if (!team) throw new NotFoundException('Team not found')

    return await this.submissionRepository.query(
      `SELECT submission.creation, challenge.points, challenge.id as challengeId, challenge.name FROM submission
          INNER JOIN challenge
          ON challenge.id = submission.challengeId
          AND submission.isValid = 1
          WHERE submission.userId IN ('${team.users.map(u => u.id).join("', '")}') 
          `
    )

    // return user.submissions.filter(s => s.isValid)
  }

  /**
   * Get valids submission for a challenge, used by player
   * @returns list of submission
   */
  async findValidsForChallenge(challengeId: string, limit: number, page: number) {
    const challenge = await this.challengesService.findOne(challengeId)
    const valids = await this.findAllValidsForChallenge(challengeId)

    const teamMode = await this.configsService.getValueFromKey(`ctf.team_mode`);
    let submissions = []
    if (teamMode) {
      submissions = await this.submissionRepository.query(
        `SELECT team.name as pseudo, team.id as id,submission.creation FROM submission
        INNER JOIN challenge
        ON challenge.id = submission.challengeId
        INNER JOIN user
        ON user.id = submission.userId
        INNER JOIN team
        ON team.id = user.teamId
        WHERE challenge.id = '${challenge.id}'
        AND submission.isValid = 1
        ORDER BY submission.creation ASC
        LIMIT ${page * limit},${limit}
        `
      )
    } else {
      submissions = await this.submissionRepository.query(
        `SELECT user.pseudo, submission.userId as id,submission.creation FROM submission
        INNER JOIN challenge
        ON challenge.id = submission.challengeId
        INNER JOIN user
        ON user.id = submission.userId
        WHERE challenge.id = '${challenge.id}'
        AND submission.isValid = 1
        ORDER BY submission.creation ASC
        LIMIT ${page * limit},${limit}
        `
      )
    }


    return { count: valids.length, data: submissions }
  }


  async findAllValidsForChallenge(challengeId: string) {
    const challenge = await this.challengesService.findOne(challengeId)

    return await this.submissionRepository.query(
      `SELECT submission.userId,submission.creation FROM submission
      INNER JOIN challenge
      ON challenge.id = submission.challengeId
      WHERE challenge.id = '${challenge.id}'
      AND submission.isValid = 1
      ORDER BY submission.creation ASC
      `
    )
  }

  async sendDiscordFirstblood(firstBloodData: FirstBloodData) {
    const hook = await this.configsService.getValueFromKey('discord.webhook_first_blood')
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
    await this.httpService.axiosRef.post(hook, data).catch(e => {
      console.error('Webhook:', e.message);
    })
  }

}

interface FirstBloodData {
  user: string,
  challenge: string
}