import { Injectable } from '@nestjs/common';
import { ChallengesService } from './challenges/challenges.service';

@Injectable()
export class AppService {

  constructor(private challengesService: ChallengesService){}

  async getScoreboard() {
    
    return [{
      pseudo: 'eteck',
      flags: [
        {challenge: 'name', date: 1675196207419, points: 280},{challenge: 'test', date: 1675093717399, points: 402},
      ],
      points: 648
    },
    {
      pseudo: 'jeanjeanlehaxor',
      flags: [
        {challenge: 'test', date: 1675096540146, points: 412},{challenge: 'name', date: 1675096732513, points: 236},
      ],
      points: 648
    }]
  }
}
