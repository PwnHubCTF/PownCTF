import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigsModule } from 'src/configs/configs.module';
import { FilesModule } from 'src/files/files.module';
import { SubmissionsModule } from 'src/submissions/submissions.module';
import { TeamsModule } from 'src/teams/teams.module';
import { DeployerService } from '../deployer/deployer.service';
import { ChallengesModule } from 'src/challenges/challenges.module';
import { DeployerController } from './deployer.controller';

@Module({
  imports: [
    ConfigsModule,
    HttpModule,
    ChallengesModule],
  controllers: [DeployerController],
  providers: [DeployerService],
  exports: [DeployerModule],
})
export class DeployerModule { }
