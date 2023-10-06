import { PassportStrategy } from '@nestjs/passport';
import { Strategy, _StrategyOptionsBase } from 'passport-google-oauth20';
import { Inject, Injectable } from '@nestjs/common';
import { VerifiedCallback } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from '@app/types/authProvider';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { DEFAULT_LANGUAGE } from '@app/types/languages';
import { DEFAULT_ROLE } from '@app/types/roles';
import { Service } from '@app/microservice/interservice-api/services';
import { UserServiceApi } from '@app/microservice/interservice-api/user';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(Service.USER_SERVICE)
    private readonly userServiceClient: ClientProxy,
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
    const defaultName = `${name.givenName} ${name.familyName}`;

    const oauthUser = {
      authProvider: AuthProvider.GOOGLE,
      authProviderId: id,
      email: emails[0].value,
      oauthName: defaultName,
      userProfile: {
        name: defaultName,
        preferredLanguageId: DEFAULT_LANGUAGE,
        roleId: DEFAULT_ROLE,
      },
    };

    const user = await firstValueFrom(
      this.userServiceClient.send(
        UserServiceApi.FIND_OR_CREATE_OAUTH_USER,
        oauthUser,
      ),
    );

    done(null, user);
  }
}
