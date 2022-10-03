import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ROLE_KEY } from '../decorators/need-role.decorator';
import { Role } from '../role.enum';

@Injectable()
export class RoleGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) { super() }

  async canActivate (context: ExecutionContext) {
    const requiredRole = this.reflector.getAllAndOverride<Role>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRole) return true
    
    // Throw an error if user isn't auth
    await super.canActivate(context)

    const { user } = context.switchToHttp().getRequest();

    return user.role >= requiredRole;
  }
}