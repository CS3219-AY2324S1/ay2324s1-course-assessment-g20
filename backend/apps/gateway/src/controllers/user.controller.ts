import {
  // Body,
  Controller,
  Get,
  Inject,
  // Post,
  // Req,
  // Res,
  // UseGuards,
} from '@nestjs/common';
import { Public } from '../jwt/jwtPublic.decorator';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
// import { Request, Response } from 'express';
// import { ConfigService } from '@nestjs/config';
// import { GoogleOauthGuard } from '../oauthProviders/google/google-oauth.guard';
// import RefreshDto from '../dtos/auth/refresh.dto';

@Controller('user')
export class UserController {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userServiceClient: ClientProxy,
    // private readonly configService: ConfigService,
  ) {}

  @Public()
  @Get()
  getSomething(): Observable<string> {
    // return 'Hello from user controller';
    return this.userServiceClient.send('get_something', {});
  }

  @Public()
  @Get('getUser')
  getUser(): Observable<string> {
    // return 'Hello from user controller';
    return this.userServiceClient.send('get_user_profile', {});
  }

  @Public()
  @Get('updateUser')
  updateUser(): Observable<string> {
    // return 'Hello from user controller';
    return this.userServiceClient.send('update_user_profile', {});
  }
}
