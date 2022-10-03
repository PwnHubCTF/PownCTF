import { Module } from '@nestjs/common';
import { ConfigsService } from './configs.service';
import { ConfigsController } from './configs.controller';
import { Config } from './entities/config.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { CtfStateGuard } from './guards/ctf-state.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Config])],
  controllers: [ConfigsController],
  providers: [ConfigsService,{
    provide: APP_GUARD,
    useClass: CtfStateGuard,
  },]
})
export class ConfigsModule { }
