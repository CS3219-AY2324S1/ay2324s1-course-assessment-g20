import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { UserModel } from './database/models/user.model';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('get_hello')
  getHello() {
    console.log('/auth get_hello called');
    return this.authService.getHello();
  }

  @MessagePattern('generate_jwts')
  generateJwts(user) {
    console.log('generate_jwts called');
    return this.authService.generateJwts(user);
  }

  @MessagePattern('generate_jwts_from_refresh_token')
  generateJwtsFromRefreshToken(refreshToken) {
    return this.authService.generateJwtsFromRefreshToken(refreshToken);
  }

  @MessagePattern('find_or_create_oauth_user')
  findOrCreateOauthUser(user: Partial<UserModel>) {
    return this.authService.findOrCreateOAuthUser(user);
  }
}
