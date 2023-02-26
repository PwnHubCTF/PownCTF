import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { NeedRole } from 'src/auth/decorators/need-role.decorator';
import { Role } from 'src/auth/role.enum';
import { SubmitXssDto } from 'src/xssbot/dto/submit-xss.dto';
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

  
  @ApiBearerAuth()
  @ApiQuery({name: 'limit', required: false})
  @ApiQuery({name: 'page', required: false})
  @NeedRole(Role.Manager)
  @Get()
  getPayloads (@Query('limit') limit = '10', @Query('page') page = '0') {
    return this.xssService.all(parseInt(limit), parseInt(page));
  }
}
