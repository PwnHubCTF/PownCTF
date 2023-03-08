import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { ChallengesModule } from 'src/challenges/challenges.module';
import { ConfigsModule } from 'src/configs/configs.module';
import { EventsModule } from 'src/events/events.module';
import { DeployerService } from '../deployer/deployer.service';
import { DeployerController } from './deployer.controller';

@Module({
  imports: [
    forwardRef(()=>ChallengesModule),
    ConfigsModule,
    HttpModule,
    EventsModule,
    ],
  controllers: [DeployerController],
  providers: [DeployerService],
  exports: [DeployerService],
})
export class DeployerModule { }
