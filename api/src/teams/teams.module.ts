import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Team } from './entities/team.entity';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

@Module({
    imports: [TypeOrmModule.forFeature([Team]),UsersModule],
    providers: [TeamsService],
    exports: [TeamsService],
    controllers: [TeamsController],
})
export class TeamsModule { }
