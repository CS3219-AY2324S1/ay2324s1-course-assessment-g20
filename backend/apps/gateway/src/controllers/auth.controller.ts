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
import { AuthController as UserAuthService } from 'apps/user/src/auth/auth.controller';
import { getPromisifiedGrpcService } from '@app/microservice/utils';
import { Service } from '@app/microservice/interservice-api/services';

@Controller('auth')
export class AuthController implements OnModuleInit {
  private userAuthService: UserAuthService;

  constructor(
    private readonly configService: ConfigService,
    @Inject(Service.USER_SERVICE) private userServiceClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userAuthService = getPromisifiedGrpcService<UserAuthService>(
      this.userServiceClient,
      'UserAuthService',
    );
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
    const { accessToken, refreshToken } =
      await this.userAuthService.generateJwts(req.user);

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
