import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChallengesService } from 'src/challenges/challenges.service';
import { ConfigsService } from 'src/configs/configs.service';
import { EventsService } from 'src/events/events.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
    constructor(@InjectRepository(Comment) protected readonly repository: Repository<Comment>,
        private readonly challengesService: ChallengesService,
        private readonly eventsService: EventsService,
        private readonly configsService: ConfigsService
    ) { }

    async findForChallenge (user: User, challengeId: string) {
        const challenge = await this.challengesService.findOne(challengeId)
        const isTeamMode = await this.configsService.getBooleanFromKey('ctf.team_mode')
        const comments = await this.repository.query(`
            SELECT comment.creation, comment.type, comment.data FROM comment 
            WHERE comment.challengeId = '${challenge.id}' 
            AND comment.ownerId = '${isTeamMode ? user.team.id : user.id}'
            ORDER BY comment.creation ASC
            `)

        return comments
    }
    async postComment (user: User, challengeId: string, createDto: CreateCommentDto) {
        const challenge = await this.challengesService.findOne(challengeId)
        const isTeamMode = await this.configsService.getBooleanFromKey('ctf.team_mode')
        const comment = this.repository.create({
            challengeId: challenge.id,
            ownerId: isTeamMode ? user.team.id : user.id,
            data: {
                text: String(createDto.text),
                author: user.pseudo
            }
        })
        await comment.save()
        let c = {
            creation: comment.creation,
            type: comment.type,
            data: comment.data,
        }
        if(isTeamMode){
            this.eventsService.sendEventToTeam(user.team.id, 'comment', {challengeId, comment: c})
        }
        return c
    }

    async postFlag (user: User, challengeId: string, flag: string, valid: boolean) {
        const isTeamMode = await this.configsService.getBooleanFromKey('ctf.team_mode')
        const comment = this.repository.create({
            challengeId: challengeId,
            ownerId: isTeamMode ? user.team.id : user.id,
            data: {
                flag,
                valid
            }
        })
        return await comment.save()
    }

}
