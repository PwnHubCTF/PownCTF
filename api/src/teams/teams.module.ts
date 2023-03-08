import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from 'src/categories/categories.module';
import { ConfigsModule } from 'src/configs/configs.module';
import { EventsModule } from 'src/events/events.module';
import { UsersModule } from 'src/users/users.module';
import { Team } from './entities/team.entity';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

@Module({
    imports: [TypeOrmModule.forFeature([Team]),UsersModule, ConfigsModule, CategoriesModule, EventsModule],
    providers: [TeamsService],
    exports: [TeamsService],
    controllers: [TeamsController],
})
export class TeamsModule { }
