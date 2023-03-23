import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailModule } from 'src/mail/mail.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RoleGuard } from './guards/role.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '2h' },
  }), MailModule],
  providers: [AuthService, JwtStrategy, {
    provide: APP_GUARD,
    useClass: RoleGuard,
  }],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule { }
