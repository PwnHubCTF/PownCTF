import { Injectable } from '@nestjs/common';
import { ChallengesService } from './challenges/challenges.service';
import { SubmissionsService } from './submissions/submissions.service';

@Injectable()
export class AppService {

  constructor(private submissionsService: SubmissionsService){}

  async getScoreboard() {
    let flags = await this.submissionsService.getScoreboard()
    
    let formattedScoreboard = []

    for (const flag of flags) {
      let player = formattedScoreboard.find(p => p.pseudo == flag.pseudo)
      if(!player){
        player = {
          pseudo: flag.pseudo,
          flags: []
        }
        formattedScoreboard.push(player)
      }
      player.flags.push({
        date: new Date(flag.date).getTime(),
        challenge: flag.challengeId,
        points: flag.points
      })
    }
    
    
    return formattedScoreboard
  }
}
