import { Module } from '@nestjs/common';
import { ConfigsService } from './configs.service';
import { ConfigsController } from './configs.controller';
import { Config } from './entities/config.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Config])],
  controllers: [ConfigsController],
  providers: [ConfigsService]
})
export class ConfigsModule { }
