import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Patch,
  Req,
} from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import PatchUserProfileDto from '../dtos/user/patchUserProfile.dto';
import { Service } from '@app/microservice/interservice-api/services';
import { UserServiceApi } from '@app/microservice/interservice-api/user';
import { AuthController as UserAuthService } from 'apps/user/src/auth/auth.controller';
import { promisify } from '@app/microservice/utils';

@Controller('user')
export class UserController implements OnModuleInit {
  private userAuthService: UserAuthService;

  constructor(
    @Inject(Service.USER_SERVICE)
    private readonly userServiceClient: ClientProxy,
    @Inject('USER_PACKAGE') private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userAuthService = promisify(
      this.client.getService<UserAuthService>('UserAuthService'),
    );
  }

  @Get()
  getUserProfile(@Req() req) {
    return this.userServiceClient.send(
      UserServiceApi.GET_USER_PROFILE,
      req.user.id,
    );
  }

  @Patch()
  patchUserProfile(@Req() req, @Body() body: PatchUserProfileDto) {
    return this.userServiceClient.send(UserServiceApi.UPDATE_USER_PROFILE, {
      userId: req.user.id,
      ...body,
    });
  }

  @Delete()
  deleteUser(@Req() req) {
    return this.userAuthService.deleteOAuthUser({ id: req.user.id });
  }
}
