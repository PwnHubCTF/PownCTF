import { Body, Controller, ForbiddenException, Get, Post, Request, UnprocessableEntityException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CTF_STATES } from 'src/configs/configs.settings';
import { CtfState } from 'src/configs/decorators/ctf-state.decorator';
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
    return this.authService.login(payload);
  }

  @CtfState(CTF_STATES.WAITING, CTF_STATES.STARTED)
  @Post('register')
  async register (@Body() payload: CreateUserPayload) {
    return this.authService.register(payload);
  }

  @ApiBearerAuth()
  @NeedRole(Role.User)
  @Get('me')
  async me (@Request() request) {
    return this.usersService.getReducedInfos(request.user.userId)
  }
}
