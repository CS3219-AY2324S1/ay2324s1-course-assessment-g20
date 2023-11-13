import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Public } from '../jwt/jwtPublic.decorator';
import { ClientGrpc } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { GoogleOauthGuard } from '../oauthProviders/google/google-oauth.guard';
import RefreshDto from '../dtos/auth/refresh.dto';
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

  @Get('ticket')
  async getWsTicket(@Req() req) {
    const ticket = await firstValueFrom(
      this.userAuthService.generateWebsocketTicket({
        userId: req.user.id,
      }),
    );
    return { id: ticket.id };
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {
    // No implementation: Guard redirects
  }

  @Public()
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

  @Public()
  @Post('refresh')
  async refreshTokenFlow(@Body() body: RefreshDto) {
    return this.userAuthService.generateJwtsFromRefreshToken({
      refreshToken: body.refreshToken,
    });
  }
}
