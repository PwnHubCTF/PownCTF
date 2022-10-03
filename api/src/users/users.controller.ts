import { Controller, Get, Param, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NeedRole } from 'src/auth/decorators/need-role.decorator';
import { Role } from 'src/auth/role.enum';
import { CTF_STATES } from 'src/configs/configs.settings';
import { CtfState } from 'src/configs/decorators/ctf-state.decorator';
import { CtfStateGuard } from 'src/configs/guards/ctf-state.guard';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Get()
  async getAll () {
    return this.usersService.getAllReducedInfos();
  }

  @ApiBearerAuth()
  @CtfState(CTF_STATES.WAITING)
  @NeedRole(Role.User)
  @Post('/category/:category')
  async setCategory (@Request() request, @Param('category') categoryId: string) {
    return this.usersService.setCategoryToUser(request.user.userId, categoryId);
  }
}
