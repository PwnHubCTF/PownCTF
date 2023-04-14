import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { NeedRole } from 'src/auth/decorators/need-role.decorator';
import { Role } from 'src/auth/role.enum';
import { CTF_STATES } from 'src/configs/configs.settings';
import { CtfState } from 'src/configs/decorators/ctf-state.decorator';
import { InjectUser } from 'src/users/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ChallengesService } from './challenges.service';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

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
  @CtfState(CTF_STATES.STARTED, CTF_STATES.FINISHED)
  @NeedRole(Role.Manager)
  @Get('mine/:userId')
  adminForUser (@Param('userId') userId: string) {
    return this.challengesService.adminFindForUser(userId);
  }

  @ApiBearerAuth()
  @ApiQuery({name: 'limit', required: false})
  @ApiQuery({name: 'page', required: false})
  @NeedRole(Role.Manager)
  @Get()
  all (@Query('limit') limit = '10', @Query('page') page = '0') {
    return this.challengesService.all(parseInt(limit), parseInt(page));
  }

  @ApiBearerAuth()
  @NeedRole(Role.Manager)
  @Post('/update-points')
  forceUpdateChallengePoints () {
    return this.challengesService.updateChallengesPoints();
  }

  @ApiBearerAuth()
  @NeedRole(Role.Manager)
  @Post('github')
  fetchFromGit () {
    return this.challengesService.fetchFromGit();
  }

  @Get('categories')
  categories () {
    return this.challengesService.getCategories();
  }

  @ApiBearerAuth()
  @NeedRole(Role.Manager)
  @Get('flag/:id/:userId')
  getSignedFlag (@Param('id') id: string, @Param('userId') userId: string) {
    return this.challengesService.signFlagFromChallengeAndUser(id,userId);
  }

  @ApiBearerAuth()
  @NeedRole(Role.Manager)
  @Patch(':id')
  edit (@Param('id') id: string, @Body() updateChallengeDto: UpdateChallengeDto) {
    return this.challengesService.edit(id, updateChallengeDto);
  }

  @ApiBearerAuth()
  @NeedRole(Role.Manager)
  @Delete(':id')
  remove (@Param('id') id: string) {
    return this.challengesService.remove(id);
  }
}
