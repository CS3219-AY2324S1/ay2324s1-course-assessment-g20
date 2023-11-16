import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { GoogleOauthGuard } from '../oauthProviders/google/google-oauth.guard';
import { Service } from '@app/microservice/services';
import {
  USER_AUTH_SERVICE_NAME,
  User,
  UserAuthServiceClient,
} from '@app/microservice/interfaces/user';
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

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {
    // No implementation: Guard redirects
  }

  @Get('google/redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } = await firstValueFrom(
      this.userAuthService.generateJwts(req.user as User),
    );

    const redirectUrl = `${this.configService.get(
      'corsOrigin',
    )}/authRedirect?accessToken=${accessToken}&refreshToken=${refreshToken}`;

    return res.redirect(redirectUrl);
  }
}
