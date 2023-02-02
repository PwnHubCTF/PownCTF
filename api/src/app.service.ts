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
          id: flag.userId,
          flags: []
        }
        formattedScoreboard.push(player)
      }
      player.flags.push({
        date: new Date(flag.creation).getTime(),
        challenge: flag.challengeId,
        challengeName: flag.name,
        points: flag.points
      })
      player.total = player.flags.map(f => f.points).reduce((a, b) => a + b)
      player.flags = player.flags.sort((a, b) => a.date - b.date)
    }
    
    
    return formattedScoreboard.sort((a, b) => a.flags[a.flags.length-1].date - b.flags[b.flags.length-1].date).sort((a, b) => b.total - a.total)
  }
}
