import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModel } from '../database/models/user.model';
import {
  CreateWebsocketTicketInfoRequest,
  RefreshTokenRequest,
  User,
  UserAuthServiceController,
  UserAuthServiceControllerMethods,
} from '@app/microservice/interfaces/user';
import { ID, IDs } from '@app/microservice/interfaces/common';

@Controller()
@UserAuthServiceControllerMethods()
export class AuthController implements UserAuthServiceController {
  constructor(private readonly authService: AuthService) {}

  generateJwts(user: User) {
    return this.authService.generateJwts(user);
  }

  generateJwtsFromRefreshToken({ refreshToken }: RefreshTokenRequest) {
    return this.authService.generateJwtsFromRefreshToken(refreshToken);
  }

  findOrCreateOauthUser(user: Partial<User>) {
    return this.authService.findOrCreateOAuthUser(user as Partial<UserModel>);
  }

  deleteOAuthUser({ id }: ID) {
    return this.authService
      .deleteOAuthUser(id)
      .then((deletedCount) => ({ deletedCount }));
  }

  async generateWebsocketTicket(
    createTicketInfo: CreateWebsocketTicketInfoRequest,
  ) {
    return this.authService.generateWebsocketTicket(createTicketInfo);
  }

  consumeWebsocketTicket({ id }: ID) {
    return this.authService.consumeWebsocketTicket(id);
  }

  validateUsersExists({ ids }: IDs) {
    return this.authService
      .validateUsersExist(ids)
      .then((value) => ({ value }));
  }
}
