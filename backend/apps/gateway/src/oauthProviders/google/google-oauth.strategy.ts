import { PassportStrategy } from '@nestjs/passport';
import { Strategy, _StrategyOptionsBase } from 'passport-google-oauth20';
import { Inject, Injectable } from '@nestjs/common';
import { VerifiedCallback } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from '@app/types/authProvider';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AUTH_SERVICE, AuthServiceApi } from '@app/interservice-api/auth';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authServiceClient: ClientProxy,
    configService: ConfigService,
  ) {
    const googleOauthOptions: _StrategyOptionsBase =
      configService.get('googleOauthOptions');
    if (!googleOauthOptions) {
      throw Error('Google OAuth environment variables not configured!');
    }

    super({
      ...googleOauthOptions,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifiedCallback,
  ) {
    const { id, name, emails } = profile;

    const user = await firstValueFrom(
      this.authServiceClient.send(AuthServiceApi.FIND_OR_CREATE_OAUTH_USER, {
        authProvider: AuthProvider.GOOGLE,
        authProviderId: id,
        email: emails[0].value,
        oauthName: `${name.givenName} ${name.familyName}`,
      }),
    );

    done(null, user);
  }
}
