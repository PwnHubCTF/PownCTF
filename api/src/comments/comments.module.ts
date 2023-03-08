import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengesModule } from 'src/challenges/challenges.module';
import { UsersModule } from 'src/users/users.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Comment]), UsersModule, ChallengesModule],
    providers: [CommentsService],
    exports: [CommentsService],
    controllers: [CommentsController],
})
export class CommentsModule { }
