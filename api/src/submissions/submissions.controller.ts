import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
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
  @ApiQuery({name: 'limit', required: false})
  @ApiQuery({name: 'page', required: false})
  @NeedRole(Role.Manager)
  @Get('/all')
  all (@Query('limit') limit = 10, @Query('page') page = 0) {
    return this.submissionsService.findAll(limit, page);
  }

  @CtfState(CTF_STATES.STARTED, CTF_STATES.FINISHED)
  @Get('user/:userId')
  submissionsByUser (@Param('userId') userId: string) {
    return this.submissionsService.findValidsByUser(userId);
  }

  @ApiBearerAuth()
  @ApiQuery({name: 'limit', required: false})
  @ApiQuery({name: 'page', required: false})
  @CtfState(CTF_STATES.STARTED, CTF_STATES.FINISHED)
  @NeedRole(Role.User)
  @Get('challenge/valids/:challenge')
  submissionsForChallenge (@Param('challenge') challengeId: string, @Query('limit') limit = '10', @Query('page') page = '0') {
    return this.submissionsService.findValidsForChallenge(challengeId, parseInt(limit), parseInt(page));
  }

  @ApiBearerAuth()
  @CtfState(CTF_STATES.STARTED, CTF_STATES.FINISHED)
  @NeedRole(Role.User)
  @Get('challenge/:challenge')
  submissionsForUserAndChallenge (@InjectUser() user: User, @Param('challenge') challengeId: string) {
    return this.submissionsService.findAllForUserAndChallenge(user, challengeId);
  }

  // @ApiBearerAuth()
  // @CtfState(CTF_STATES.STARTED, CTF_STATES.FINISHED)
  // @NeedRole(Role.User)
  // @Get('valids')
  // validsSubmissionsForUser (@InjectUser() user: User) {
  //   return this.submissionsService.findValidsForUser(user);
  // }

  // @ApiQuery({name: 'category', required: false})
  // @Get('top-users-challenge-category/:category/:limit')
  // async getTopUsersForChallengeCategory (@Param('category') category: string, @Param('limit') limit: string, @Query('category') playerCategory = null) {
  //   return this.submissionsService.getTopUsersForChallengeCategory(category, parseInt(limit), playerCategory);
  // }

  @ApiQuery({name: 'category', required: false})
  @Get('top-users-challenge-categories')
  async getTopUsersForAllChallengeCategory (@Query('category') playerCategory = null) {
    return this.submissionsService.getTopUsersForAllChallengeCategory(playerCategory);
  }

  // @ApiQuery({name: 'category', required: false})
  // @Get('top-teams-challenge-category/:category/:limit')
  // async getTopTeamsForChallengeCategory (@Param('category') category: string, @Param('limit') limit: string, @Query('category') playerCategory = null) {
  //   return this.submissionsService.getTopTeamsForChallengeCategory(category, parseInt(limit), playerCategory);
  // }

  @ApiQuery({name: 'category', required: false})
  @Get('top-teams-challenge-categories')
  async getTopTeamsForAllChallengeCategory (@Query('category') playerCategory = null) {
    return this.submissionsService.getTopTeamsForAllChallengeCategory(playerCategory);
  }

  @Get('team/valids/:id')
  validsSubmissionsForTeam (@Param('id') teamId: string) {
    return this.submissionsService.findValidsForTeam(teamId);
  }
}
