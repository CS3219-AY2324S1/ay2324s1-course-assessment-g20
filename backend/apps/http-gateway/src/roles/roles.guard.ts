import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@app/types/roles';
import { ROLES_KEY } from './roles.decorator';
import { Service } from '@app/microservice/services';
import { ClientGrpc } from '@nestjs/microservices';
import {
  USER_PROFILE_SERVICE_NAME,
  UserProfileServiceClient,
} from '@app/microservice/interfaces/user';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate, OnModuleInit {
  private userProfileService: UserProfileServiceClient;

  constructor(
    private reflector: Reflector,
    @Inject(Service.USER_SERVICE) private userServiceClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userProfileService =
      this.userServiceClient.getService<UserProfileServiceClient>(
        USER_PROFILE_SERVICE_NAME,
      );
  }

  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const { roleId } = await firstValueFrom(
      this.userProfileService.getUserProfileById({ id: user.id }),
    );
    return requiredRoles.some((requiredRoleId) => roleId === requiredRoleId);
  }
}
