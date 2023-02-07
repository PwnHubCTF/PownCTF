import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengesModule } from 'src/challenges/challenges.module';
import { ConfigsModule } from 'src/configs/configs.module';
import { DeployerService } from '../deployer/deployer.service';
import { DeployerController } from './deployer.controller';
import { Deployer } from './entities/deployer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Deployer]),
    forwardRef(()=>ChallengesModule),
    ConfigsModule,
    HttpModule,
    ],
  controllers: [DeployerController],
  providers: [DeployerService],
  exports: [DeployerService],
})
export class DeployerModule { }
