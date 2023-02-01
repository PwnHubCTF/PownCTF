import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NeedRole } from 'src/auth/decorators/need-role.decorator';
import { Role } from 'src/auth/role.enum';
import { CTF_STATES } from 'src/configs/configs.settings';
import { CtfState } from 'src/configs/decorators/ctf-state.decorator';
import { InjectUser } from 'src/users/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { SubmitDto } from './dto/submit.dto';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
@ApiTags('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) { }

  @ApiBearerAuth()
  @CtfState(CTF_STATES.STARTED)
  @NeedRole(Role.User)
  @Post()
  submit (@InjectUser() user: User, @Body() payload: SubmitDto) {
    return this.submissionsService.submit(user, payload.challengeId, payload.flag);
  }

  @ApiBearerAuth()
  @CtfState(CTF_STATES.STARTED, CTF_STATES.FINISHED)
  @NeedRole(Role.Admin)
  @Get('/all')
  all () {
    return this.submissionsService.findAll();
  }

  // @ApiBearerAuth()
  // @CtfState(CTF_STATES.STARTED, CTF_STATES.FINISHED)
  // @NeedRole(Role.User)
  // @Get()
  // submissionsForUser (@InjectUser() user: User) {
  //   return this.submissionsService.findForUser(user);
  // }

  @CtfState(CTF_STATES.STARTED, CTF_STATES.FINISHED)
  @Get('user/:userId')
  submissionsByUser (@Param('userId') userId: string) {
    return this.submissionsService.findValidsByUser(userId);
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

  @Get('team/valids/:id')
  validsSubmissionsForTeam (@Param('id') teamId: string) {
    return this.submissionsService.findValidsForTeam(teamId);
  }
}
