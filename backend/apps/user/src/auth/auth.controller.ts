import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateUserRequest,
  UserAuthServiceController,
  UserAuthServiceControllerMethods,
} from '@app/microservice/interfaces/user';
import { ID } from '@app/microservice/interfaces/common';

@Controller()
@UserAuthServiceControllerMethods()
export class AuthController implements UserAuthServiceController {
  constructor(private readonly authService: AuthService) {}

  createUser(request: CreateUserRequest) {
    return this.authService.createUser(request.name);
  }

  deleteUser({ id }: ID) {
    return this.authService
      .deleteUser(id)
      .then((deletedCount) => ({ deletedCount }));
  }
}
