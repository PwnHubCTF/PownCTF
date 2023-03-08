import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
    constructor(@InjectRepository(Comment) protected readonly repository: Repository<Comment>,
    ) { }

    async findForChallenge (id: string, challengeId: string) {
        throw new Error('Method not implemented.');
    }
    async postComment (id: string, challengeId: string, createDto: CreateCommentDto) {
        throw new Error('Method not implemented.');
    }
}
