import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModel } from '../database/models/user.model';
import {
  User,
  UserAuthServiceController,
  UserAuthServiceControllerMethods,
} from '@app/microservice/interfaces/user';
import { ID } from '@app/microservice/interfaces/common';

@Controller()
@UserAuthServiceControllerMethods()
export class AuthController implements UserAuthServiceController {
  constructor(private readonly authService: AuthService) {}

  findOrCreateOauthUser(user: Partial<User>) {
    return this.authService.findOrCreateOAuthUser(user as Partial<UserModel>);
  }

  deleteOAuthUser({ id }: ID) {
    return this.authService
      .deleteOAuthUser(id)
      .then((deletedCount) => ({ deletedCount }));
  }
}
