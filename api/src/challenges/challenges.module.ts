import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigsModule } from 'src/configs/configs.module';
import { FilesModule } from 'src/files/files.module';
import { SubmissionsModule } from 'src/submissions/submissions.module';
import { TeamsModule } from 'src/teams/teams.module';
import { UsersModule } from 'src/users/users.module';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { Challenge } from './entities/challenge.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Challenge]),
    ConfigsModule,
    forwardRef(() => SubmissionsModule),
    TeamsModule,
    FilesModule, UsersModule],
  controllers: [ChallengesController],
  providers: [ChallengesService],
  exports: [ChallengesService],
})
export class ChallengesModule { }
