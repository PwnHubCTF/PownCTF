import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NeedRole } from 'src/auth/decorators/need-role.decorator';
import { Role } from 'src/auth/role.enum';
import { ChallengesService } from 'src/challenges/challenges.service';
import { CTF_STATES } from 'src/configs/configs.settings';
import { CtfState } from 'src/configs/decorators/ctf-state.decorator';
import { InjectUser } from 'src/users/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { DeployerService } from './deployer.service';

@Controller('deployer')
@ApiTags('deployer')
export class DeployerController {
  constructor(private readonly deployerService: DeployerService) { }

  @ApiBearerAuth()
  @NeedRole(Role.Manager)
  @Get()
  instanceAll () {
    return this.deployerService.getInstances();
  }

  @ApiBearerAuth()
  @Get(':id')
  @NeedRole(Role.User)
  instanceStatus (@InjectUser() user: User, @Param('id') id: string) {
    return this.deployerService.getInstanceStatus(id, user);
  }

  // TODO: Maybe differenciate user and admin for deployment route, to avoid CTF_STATES.WAITING for admin deployement
  @ApiBearerAuth()
  @Post('deploy/:id')  
  @CtfState(CTF_STATES.WAITING, CTF_STATES.STARTED)
  @NeedRole(Role.User)
  deploy (@InjectUser() user: User, @Param('id') id: string) {
    return this.deployerService.deploy(id, user);
  }

  @ApiBearerAuth()
  @Post('stop/:id')  
  @CtfState(CTF_STATES.WAITING, CTF_STATES.STARTED)
  @NeedRole(Role.User)
  stop (@InjectUser() user: User, @Param('id') id: string) {
    return this.deployerService.stop(id, user);
  }

  @ApiBearerAuth()
  @Post('reset-cooldown/:id')  
  @CtfState(CTF_STATES.STARTED)
  @NeedRole(Role.User)
  resetCooldown (@InjectUser() user: User, @Param('id') id: string) {
    return this.deployerService.resetCooldown(id, user);
  }
}
