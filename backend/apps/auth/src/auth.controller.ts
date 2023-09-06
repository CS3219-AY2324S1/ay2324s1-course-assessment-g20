import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('generate_jwts')
  generateJwts(user) {
    return this.authService.generateJwts(user);
  }

  @MessagePattern('generate_jwts_from_refresh_token')
  generateJwtsFromRefreshToken(refreshToken) {
    return this.authService.generateJwtsFromRefreshToken(refreshToken);
  }
}
