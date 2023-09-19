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

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authServiceClient: ClientProxy,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Get()
  @UseGuards(GoogleOauthGuard)
  async getHello() {
    return this.authServiceClient.send('get_hello', {});
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
    // console.log("Redirecting");
    // console.log(req);
    console.log('req.user in /google/redirect', req.user);
    const { accessToken, refreshToken } = await firstValueFrom(
      this.authServiceClient.send('generate_jwts', req.user),
    );
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    const redirectUrl = `${this.configService.get(
      'corsOrigin',
    )}/authRedirect?accessToken=${accessToken}&refreshToken=${refreshToken}`;
    // console.log('redirectUrl', redirectUrl);
    return res.redirect(redirectUrl);
  }

  @Public()
  @Post('refresh')
  async refreshTokenFlow(@Body() body: RefreshDto) {
    return this.authServiceClient.send(
      'generate_jwts_from_refresh_token',
      body.refreshToken,
    );
  }
}
