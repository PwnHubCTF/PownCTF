import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengesModule } from 'src/challenges/challenges.module';
import { ConfigsModule } from 'src/configs/configs.module';
import { DeployerModule } from 'src/deployer/deployer.module';
import { TeamsModule } from 'src/teams/teams.module';
import { UsersModule } from 'src/users/users.module';
import { Submission } from './entities/submission.entity';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsService } from './submissions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Submission]), forwardRef(() => ChallengesModule),
    TeamsModule,
    ConfigsModule,
    HttpModule,
    DeployerModule,
    UsersModule],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
  exports: [SubmissionsService],
})
export class SubmissionsModule { }
