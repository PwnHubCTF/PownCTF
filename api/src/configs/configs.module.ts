import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigsController } from './configs.controller';
import { ConfigsService } from './configs.service';
import { Config } from './entities/config.entity';
import { CtfStateGuard } from './guards/ctf-state.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Config])],
  controllers: [ConfigsController],
  providers: [ConfigsService, {
    provide: APP_GUARD,
    useClass: CtfStateGuard,
  },]
})
export class ConfigsModule { }
