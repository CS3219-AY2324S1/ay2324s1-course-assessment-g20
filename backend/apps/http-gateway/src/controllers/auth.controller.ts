import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Service } from '@app/microservice/services';
import {
  USER_AUTH_SERVICE_NAME,
  UserAuthServiceClient,
} from '@app/microservice/interfaces/user';
import CreateUserDto from '../dtos/user/createUser.dto';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController implements OnModuleInit {
  private userAuthService: UserAuthServiceClient;

  constructor(
    @Inject(Service.USER_SERVICE) private userServiceClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userAuthService =
      this.userServiceClient.getService<UserAuthServiceClient>(
        USER_AUTH_SERVICE_NAME,
      );
  }

  // Endpoint separated out from user.controller.ts to facilitate migration
  // to OAuth in the next assignment.
  @Post('createUser')
  async createUser(@Body() body: CreateUserDto) {
    const createdUser = await firstValueFrom(
      this.userAuthService.createUser({ name: body.name }),
    );

    return createdUser;
  }
}
