import { Injectable } from '@nestjs/common';
import { ChallengesService } from './challenges/challenges.service';
import { SubmissionsService } from './submissions/submissions.service';

@Injectable()
export class AppService {
  private theme: string
  constructor(private submissionsService: SubmissionsService, private challengesService: ChallengesService) { }

  async getScoreboard (category: string = null) {
    let submissions = await this.submissionsService.getScoreboard(category)
    let standings = []

    for (const submission of submissions) {
      let standing = standings.find(p => p.team == submission.team)
      if (!standing) {
        standing = {
          team: submission.team,
          score: 0,
          taskStats: {}
        }
        standings.push(standing)
      }

      standing.score += submission.points
      standing.taskStats[submission.name] = {
        points: submission.points,
        time: Math.round(submission.time.getTime() / 1000)
      }
    }


    return {
      "tasks": (await this.challengesService.all()).data.map(c => c.name),
      "standings": standings
    }
  }


  async getTheme () {
    return this.theme
  }

  async setTheme (theme) {
    this.theme = theme
    return true
  }
}
