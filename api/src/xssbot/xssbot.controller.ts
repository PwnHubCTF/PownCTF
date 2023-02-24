import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NeedRole } from 'src/auth/decorators/need-role.decorator';
import { Role } from 'src/auth/role.enum';
import { SubmitXssDto } from 'src/challenges/dto/submit-xss.dto';
import { CTF_STATES } from 'src/configs/configs.settings';
import { CtfState } from 'src/configs/decorators/ctf-state.decorator';
import { InjectUser } from 'src/users/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { XSSBotService } from './xssbot.service';

@Controller('xss')
@ApiTags('xss')
export class XSSBotController {
  constructor(private readonly xssService: XSSBotService) { }

  @ApiBearerAuth()
  @CtfState(CTF_STATES.STARTED, CTF_STATES.FINISHED)
  @NeedRole(Role.User)
  @Post(':challengeId')
  submitXss (@InjectUser() user: User, @Param('challengeId') challengeId: string, @Body() payload: SubmitXssDto) {
    return this.xssService.sendXss(user, challengeId, payload);
  }

}
