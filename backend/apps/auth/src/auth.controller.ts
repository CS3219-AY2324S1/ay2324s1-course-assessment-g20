import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { UserModel } from './database/models/user.model';
import { AuthServiceApi } from '@app/interservice-api/auth';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AuthServiceApi.GENERATE_JWTS)
  generateJwts(user) {
    return this.authService.generateJwts(user);
  }

  @MessagePattern(AuthServiceApi.GENERATE_JWTS_FROM_REFRESH_TOKEN)
  generateJwtsFromRefreshToken(refreshToken) {
    return this.authService.generateJwtsFromRefreshToken(refreshToken);
  }

  @MessagePattern(AuthServiceApi.FIND_OR_CREATE_OAUTH_USER)
  findOrCreateOauthUser(user: Partial<UserModel>) {
    return this.authService.findOrCreateOAuthUser(user);
  }
}
