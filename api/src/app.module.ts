import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoleGuard } from './auth/guards/role.guard';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth/auth.controller';
import { TeamsController } from './teams/teams.controller';
import { TeamsService } from './teams/teams.service';
import { TeamsModule } from './teams/teams.module';
import { ConfigsModule } from './configs/configs.module';
import { CategoriesModule } from './categories/categories.module';
import { CategoriesController } from './categories/categories.controller';
import { CtfStateGuard } from './configs/guards/ctf-state.guard';

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
  }),
    AuthModule,
    UsersModule,
    TeamsModule,
    ConfigsModule,
    CategoriesModule],
  controllers: [AppController],
  providers: [
    AppService],
})
export class AppModule { }
