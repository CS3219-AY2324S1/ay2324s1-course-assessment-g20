import { PassportStrategy } from '@nestjs/passport';
import { Strategy, _StrategyOptionsBase } from 'passport-google-oauth20';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { VerifiedCallback } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from '@app/types/authProvider';
import { ClientGrpc } from '@nestjs/microservices';
import { DEFAULT_LANGUAGE } from '@app/types/languages';
import { DEFAULT_ROLE } from '@app/types/roles';
import { Service } from '@app/microservice/services';
import {
  USER_AUTH_SERVICE_NAME,
  UserAuthServiceClient,
} from '@app/microservice/interfaces/user';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GoogleOauthStrategy
  extends PassportStrategy(Strategy, 'google')
  implements OnModuleInit
{
  private userAuthService: UserAuthServiceClient;

  constructor(
    @Inject(Service.USER_SERVICE) private userServiceClient: ClientGrpc,
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

  onModuleInit() {
    this.userAuthService =
      this.userServiceClient.getService<UserAuthServiceClient>(
        USER_AUTH_SERVICE_NAME,
      );
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifiedCallback,
  ) {
    const { id, name, emails } = profile;
    const defaultName = `${name.givenName} ${name.familyName}`;
    const defautUsername = null;

    const oauthUser = {
      authProvider: AuthProvider.GOOGLE,
      authProviderId: id,
      email: emails[0].value,
      oauthName: defaultName,
      userProfile: {
        name: defaultName,
        username: defautUsername,
        preferredLanguageId: DEFAULT_LANGUAGE,
        roleId: DEFAULT_ROLE,
      },
    };

    const user = await firstValueFrom(
      this.userAuthService.findOrCreateOauthUser(oauthUser),
    );

    done(null, user);
  }
}
