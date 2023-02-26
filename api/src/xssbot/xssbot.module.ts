import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengesModule } from 'src/challenges/challenges.module';
import { ConfigsModule } from 'src/configs/configs.module';
import { DeployerModule } from 'src/deployer/deployer.module';
import { XSSSubmission } from './entities/xss-submission.entity';
import { XSSBotController } from './xssbot.controller';
import { XSSBotService } from './xssbot.service';

@Module({
  imports: [TypeOrmModule.forFeature([XSSSubmission]),
    forwardRef(()=>ChallengesModule),
    DeployerModule,
    ConfigsModule,
    HttpModule,
    ],
  controllers: [XSSBotController],
  providers: [XSSBotService],
  exports: [XSSBotService],
})
export class XSSBotModule { }
