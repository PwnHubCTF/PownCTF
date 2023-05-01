import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { ROLE_KEY } from '../decorators/need-role.decorator';
import { Role } from '../role.enum';

@Injectable()
export class RoleGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger("Route");
  constructor(private reflector: Reflector, private usersService: UsersService) { super() }

  async canActivate (context: ExecutionContext) {
    const requiredRole = this.reflector.getAllAndOverride<Role>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRole) return true

    // Throw an error if user isn't auth
    await super.canActivate(context)

    const request = context.switchToHttp().getRequest();
    // Inject user in request. Maybe to heavy ?
    request.injectedUser = await this.usersService.get(request.user.userId)
    this.logger.debug(`[${request.injectedUser.pseudo}] (${context['args'][0].method}) ${context['args'][0].url} ${JSON.stringify(context['args'][0].body)}`)

    return request.injectedUser.role >= requiredRole;
  }
}