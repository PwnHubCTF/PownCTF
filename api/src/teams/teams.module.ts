import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigsModule } from 'src/configs/configs.module';
import { UsersModule } from 'src/users/users.module';
import { Team } from './entities/team.entity';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

@Module({
    imports: [TypeOrmModule.forFeature([Team]),UsersModule, ConfigsModule],
    providers: [TeamsService],
    exports: [TeamsService],
    controllers: [TeamsController],
})
export class TeamsModule { }
