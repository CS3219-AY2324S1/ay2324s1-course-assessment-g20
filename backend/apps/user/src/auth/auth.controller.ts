import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { UserModel } from '../database/models/user.model';
import { CreateWebsocketTicketInfo, UserServiceApi } from '@app/interservice-api/user';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(UserServiceApi.GENERATE_JWTS)
  generateJwts(user) {
    return this.authService.generateJwts(user);
  }

  @MessagePattern(UserServiceApi.GENERATE_JWTS_FROM_REFRESH_TOKEN)
  generateJwtsFromRefreshToken(refreshToken) {
    return this.authService.generateJwtsFromRefreshToken(refreshToken);
  }

  @MessagePattern(UserServiceApi.FIND_OR_CREATE_OAUTH_USER)
  findOrCreateOauthUser(user: Partial<UserModel>) {
    return this.authService.findOrCreateOAuthUser(user);
  }

  @MessagePattern(UserServiceApi.DELETE_OAUTH_USER)
  deleteOAuthUser(id: string) {
    return this.authService.deleteOAuthUser(id);
  }

  @MessagePattern(UserServiceApi.GENERATE_WEBSOCKET_TICKET)
  generateWebsocketTicket(createTicketInfo: CreateWebsocketTicketInfo) {
    return this.authService.generateWebsocketTicket(createTicketInfo);
  }

  @MessagePattern(UserServiceApi.CONSUME_WEBSOCKET_TICKET)
  consumeWebsocketTicket(ticketId: string) {
    console.log('calling auth consume controoler');
    return this.authService.consumeWebsocketTicket(ticketId);
  }
}
