import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GrpcMethod } from '@nestjs/microservices';
import { UserModel } from '../database/models/user.model';
import { CreateWebsocketTicketInfo } from '@app/microservice/interservice-api/user';

const UserAuthServiceGrpcMethod: MethodDecorator =
  GrpcMethod('UserAuthService');

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UserAuthServiceGrpcMethod
  generateJwts(user) {
    return this.authService.generateJwts(user);
  }

  @UserAuthServiceGrpcMethod
  generateJwtsFromRefreshToken({ refreshToken }: { refreshToken: string }) {
    return this.authService.generateJwtsFromRefreshToken(refreshToken);
  }

  @UserAuthServiceGrpcMethod
  findOrCreateOauthUser(user: Partial<UserModel>) {
    return this.authService.findOrCreateOAuthUser(user);
  }

  @UserAuthServiceGrpcMethod
  deleteOAuthUser({ id }: { id: string }) {
    return this.authService.deleteOAuthUser(id);
  }

  @UserAuthServiceGrpcMethod
  async generateWebsocketTicket(createTicketInfo: CreateWebsocketTicketInfo) {
    return this.authService.generateWebsocketTicket(createTicketInfo);
  }

  @UserAuthServiceGrpcMethod
  consumeWebsocketTicket({ id }: { id: string }) {
    return this.authService.consumeWebsocketTicket(id);
  }

  @UserAuthServiceGrpcMethod
  validateUsersExists({ ids }: { ids: string[] }) {
    return this.authService
      .validateUsersExist(ids)
      .then((value) => ({ value }));
  }
}
