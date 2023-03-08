import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengesModule } from 'src/challenges/challenges.module';
import { ConfigsModule } from 'src/configs/configs.module';
import { EventsModule } from 'src/events/events.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Comment]),
        ChallengesModule,
        EventsModule,
        ConfigsModule],
    providers: [CommentsService],
    exports: [CommentsService],
    controllers: [CommentsController],
})
export class CommentsModule { }
