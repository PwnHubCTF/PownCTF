import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ChallengesModule } from './challenges/challenges.module';
import { CommentsModule } from './comments/comments.module';
import { ConfigsModule } from './configs/configs.module';
import { DeployerModule } from './deployer/deployer.module';
import { EventsModule } from './events/events.module';
import { FilesModule } from './files/files.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { TeamsModule } from './teams/teams.module';
import { UsersModule } from './users/users.module';
import { XSSBotModule } from './xssbot/xssbot.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    autoLoadEntities: true,
    synchronize: true,
    cache: true
  }),
    AuthModule,
    UsersModule,
    TeamsModule,
    ConfigsModule,
    CategoriesModule,
    ChallengesModule,
    SubmissionsModule,
    DeployerModule,
    XSSBotModule,
    FilesModule,
    CommentsModule,
    EventsModule],
  controllers: [AppController],
  providers: [
    AppService],
})
export class AppModule { }
