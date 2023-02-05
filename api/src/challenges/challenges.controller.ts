import { Controller, Delete, Get, Param, Post, Res, StreamableFile } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { join } from 'path';
import { NeedRole } from 'src/auth/decorators/need-role.decorator';
import { Role } from 'src/auth/role.enum';
import { CTF_STATES } from 'src/configs/configs.settings';
import { CtfState } from 'src/configs/decorators/ctf-state.decorator';
import { InjectUser } from 'src/users/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ChallengesService } from './challenges.service';
import type { Response } from 'express';

@Controller('challenges')
@ApiTags('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) { }

  @ApiBearerAuth()
  @CtfState(CTF_STATES.STARTED, CTF_STATES.FINISHED)
  @NeedRole(Role.User)
  @Get('mine')
  forUser (@InjectUser() user: User) {
    return this.challengesService.findForUser(user);
  }

  @ApiBearerAuth()
  @NeedRole(Role.Admin)
  @Get()
  all () {
    return this.challengesService.all();
  }

  @ApiBearerAuth()
  @NeedRole(Role.Admin)
  @Get('instance')
  instanceAll () {
    return this.challengesService.getInstances();
  }

  @ApiBearerAuth()
  // @CtfState(CTF_STATES.WAITING)
  @NeedRole(Role.Admin)
  @Post('github')
  fetchFromGit () {
    return this.challengesService.fetchFromGit();
  }

  @Get('categories')
  categories () {
    return this.challengesService.getCategories();
  }

  @ApiBearerAuth()
  @Get('instance/:id')
  @NeedRole(Role.User)
  instanceStatus (@InjectUser() user: User, @Param('id') id: string) {
    return this.challengesService.getInstanceStatus(id, user);
  }

  @ApiBearerAuth()
  @Post(':id/deploy')  
  @CtfState(CTF_STATES.WAITING, CTF_STATES.STARTED)
  @NeedRole(Role.User)
  deploy (@InjectUser() user: User, @Param('id') id: string) {
    return this.challengesService.deploy(id, user);
  }

  @ApiBearerAuth()
  @Post(':id/stop')  
  @CtfState(CTF_STATES.STARTED)
  @NeedRole(Role.User)
  stop (@InjectUser() user: User, @Param('id') id: string) {
    return this.challengesService.stop(id, user);
  }

  // @Post()
  // create (@Body() createChallengeDto: CreateChallengeDto) {
  //   return this.challengesService.create(createChallengeDto);
  // }

  // @Get()
  // findAll () {
  //   return this.challengesService.findAll();
  // }

  // @Get(':id')
  // findOne (@Param('id') id: string) {
  //   return this.challengesService.findOne(+id);
  // }

  // @Patch(':id')
  // update (@Param('id') id: string, @Body() updateChallengeDto: UpdateChallengeDto) {
  //   return this.challengesService.update(+id, updateChallengeDto);
  // }
  @ApiBearerAuth()
  @NeedRole(Role.Admin)
  @Delete(':id')
  remove (@Param('id') id: string) {
    return this.challengesService.remove(id);
  }
}
