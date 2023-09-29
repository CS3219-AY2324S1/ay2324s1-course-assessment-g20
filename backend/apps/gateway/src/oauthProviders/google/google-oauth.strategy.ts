import { PassportStrategy } from '@nestjs/passport';
import { Strategy, _StrategyOptionsBase } from 'passport-google-oauth20';
import { Inject, Injectable } from '@nestjs/common';
import { VerifiedCallback } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from '@app/types/authProvider';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { USER_SERVICE, UserServiceApi } from '@app/interservice-api/user';
import { UserProfileModel } from 'apps/user/src/database/models/userProfile.model';
import { Language } from '@app/types/languages';
import { Role } from '@app/types/roles';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(USER_SERVICE) private readonly userServiceClient: ClientProxy,
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

    const oauthUser = {
      authProvider: AuthProvider.GOOGLE,
      authProviderId: id,
      email: emails[0].value,
      oauthName: `${name.givenName} ${name.familyName}`,
      userProfile: {
        name: `${name.givenName} ${name.familyName}`,
        preferredLanguageId: Language.JAVASCRIPT,
        roleId: Role.REGULAR,
      } as UserProfileModel,
    };

    const user = await firstValueFrom(
      this.userServiceClient.send(UserServiceApi.FIND_OR_CREATE_OAUTH_USER, oauthUser),
    );

    done(null, user);
  }
}
