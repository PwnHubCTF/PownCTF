import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigsModule } from 'src/configs/configs.module';
import { FilesModule } from 'src/files/files.module';
import { SubmissionsModule } from 'src/submissions/submissions.module';
import { TeamsModule } from 'src/teams/teams.module';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { DeployerService } from './deployer.service';
import { Challenge } from './entities/challenge.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Challenge]),
    ConfigsModule,
    forwardRef(() => SubmissionsModule),
    TeamsModule,
    HttpModule,
    FilesModule],
  controllers: [ChallengesController],
  providers: [ChallengesService, DeployerService],
  exports: [ChallengesService],
})
export class ChallengesModule { }
