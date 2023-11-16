import {
  Controller,
  Inject,
  OnModuleInit,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
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
    private readonly configService: ConfigService,
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
  @Post()
  async createUser(@Req() req: CreateUserDto, @Res() res: Response) {
    const createdUser = await firstValueFrom(
      this.userAuthService.createUser({ name: req.name }),
    );
    const redirectUrl = `${this.configService.get(
      'corsOrigin',
    )}/authRedirect?userId=${createdUser.id}`;

    return res.redirect(redirectUrl);
  }
}
