import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NeedRole } from 'src/auth/decorators/need-role.decorator';
import { Role } from 'src/auth/role.enum';
import { CTF_STATES } from 'src/configs/configs.settings';
import { CtfState } from 'src/configs/decorators/ctf-state.decorator';
import { InjectUser } from 'src/users/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
@ApiTags('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) { }

  @ApiBearerAuth()
  @CtfState(CTF_STATES.STARTED, CTF_STATES.FINISHED)
  @NeedRole(Role.User)
  @Get('')
  submissionsForUser (@InjectUser() user: User) {
    return this.submissionsService.findForUser(user);
  }

  @ApiBearerAuth()
  @CtfState(CTF_STATES.STARTED, CTF_STATES.FINISHED)
  @NeedRole(Role.User)
  @Get('challenge/valids/:challenge')
  submissionsForChallenge (@Param('challenge') challengeId: string) {
    return this.submissionsService.findValidsForChallenge(challengeId);
  }

  @ApiBearerAuth()
  @CtfState(CTF_STATES.STARTED, CTF_STATES.FINISHED)
  @NeedRole(Role.User)
  @Get('challenge/:challenge')
  submissionsForUserAndChallenge (@InjectUser() user: User, @Param('challenge') challengeId: string) {
    return this.submissionsService.findAllForUserAndChallenge(user, challengeId);
  }

  @ApiBearerAuth()
  @CtfState(CTF_STATES.STARTED, CTF_STATES.FINISHED)
  @NeedRole(Role.User)
  @Get('valids')
  validsSubmissionsForUser (@InjectUser() user: User) {
    return this.submissionsService.findValidsForUser(user);
  }
}
