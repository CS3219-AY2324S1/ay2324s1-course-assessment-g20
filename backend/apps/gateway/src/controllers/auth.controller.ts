import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Public } from '../jwt/jwtPublic.decorator';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { GoogleOauthGuard } from '../oauthProviders/google/google-oauth.guard';
import RefreshDto from '../dtos/auth/refresh.dto';
import { UserServiceApi } from '@app/interservice-api/user';
import { Service } from '@app/interservice-api/services';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(Service.USER_SERVICE)
    private readonly userServiceClient: ClientProxy,
    private readonly configService: ConfigService,
  ) {}

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
      this.userServiceClient.send(UserServiceApi.GENERATE_JWTS, req.user),
    );
    const redirectUrl = `${this.configService.get(
      'corsOrigin',
    )}/authRedirect?accessToken=${accessToken}&refreshToken=${refreshToken}`;

    return res.redirect(redirectUrl);
  }

  @Public()
  @Post('refresh')
  async refreshTokenFlow(@Body() body: RefreshDto) {
    return this.userServiceClient.send(
      UserServiceApi.GENERATE_JWTS_FROM_REFRESH_TOKEN,
      body.refreshToken,
    );
  }
}
