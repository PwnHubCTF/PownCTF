import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { CreateUserPayload } from './dto/create-user.payload';
import { LoginUserPayload } from './dto/login-user.payload';

@Controller('auth')
@ApiTags('authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }

  @Post('login')
  async login (@Body() payload: LoginUserPayload) {
    const user = await this.usersService.getFromEmail(payload.email)
    if (!user) throw new Error("User not found");
    if (user.password !== payload.password) throw new Error("Incorrect password");

    return this.authService.login(user);
  }

  @Post('register')
  async register (@Body() payload: CreateUserPayload) {
    const user = await this.usersService.create(payload);
    return this.authService.login(user);
  }
}
