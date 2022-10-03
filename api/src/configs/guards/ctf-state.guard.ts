import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigsService } from '../configs.service';
import { CTF_STATE_KEY } from '../decorators/ctf-state.decorator';

@Injectable()
export class CtfStateGuard implements CanActivate {
  constructor(private reflector: Reflector, @Inject(ConfigsService) private configService: ConfigsService) { }

  async canActivate (context: ExecutionContext) {
    const states = this.reflector.get<string[]>(CTF_STATE_KEY, context.getHandler());
    if (!states) return true
    let state = await this.configService.getValueFromKey('ctf.state')
    return states.find(s => s == state) != null
  }
}
