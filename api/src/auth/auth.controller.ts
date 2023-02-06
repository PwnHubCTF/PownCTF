import { Body, Controller, ForbiddenException, Get, Post, Request, UnprocessableEntityException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { NeedRole } from './decorators/need-role.decorator';
import { CreateUserPayload } from './dto/create-user.payload';
import { LoginUserPayload } from './dto/login-user.payload';
import { Role } from './role.enum';
@Controller('auth')
@ApiTags('authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }

  @Post('login')
  async login (@Body() payload: LoginUserPayload) {
    if (!payload.email || !payload.password) throw new UnprocessableEntityException('Missing fields')
    const hashed = require('crypto').createHash('sha256').update(payload.password, 'utf8').digest('hex');
    const user = await this.usersService.getFromEmail(payload.email)
    if (!user) throw new ForbiddenException("User not found / Incorrect password");
    if (user.password !== hashed) throw new ForbiddenException("User not found / Incorrect password");

    return this.authService.login(user);
  }

  @Post('register')
  async register (@Body() payload: CreateUserPayload) {
    if (!payload.email || !payload.password || !payload.pseudo) throw new UnprocessableEntityException('Missing fields')
    
    const user = await this.usersService.create(payload);
    return this.authService.login(user);
  }

  @ApiBearerAuth()
  @NeedRole(Role.User)
  @Get('me')
  async me (@Request() request) {
    return this.usersService.getReducedInfos(request.user.userId)
  }
}
