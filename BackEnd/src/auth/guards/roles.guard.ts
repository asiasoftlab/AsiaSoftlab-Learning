import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/users.service';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private usersService: UsersService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user || !user.uid) {
      throw new ForbiddenException('User is not authenticated');
    }

    const userProfile = await this.usersService.findById(user.uid);

    if (!userProfile) {
      throw new ForbiddenException('User profile not found');
    }

    const hasRole = requiredRoles.includes(userProfile.role);
    if (!hasRole) {
      throw new ForbiddenException(`Require one of these roles: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
