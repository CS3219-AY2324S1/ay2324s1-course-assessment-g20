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
import { ClientGrpc } from '@nestjs/microservices';
import PatchUserProfileDto from '../dtos/user/patchUserProfile.dto';
import { AuthController as UserAuthService } from 'apps/user/src/auth/auth.controller';
import { ProfileController as UserProfileService } from 'apps/user/src/profile/profile.controller';
import { getPromisifiedGrpcService } from '@app/microservice/utils';
import { Service } from '@app/microservice/interservice-api/services';

@Controller('user')
export class UserController implements OnModuleInit {
  private userAuthService: UserAuthService;
  private userProfileService: UserProfileService;

  constructor(
    @Inject(Service.USER_SERVICE) private userServiceClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userAuthService = getPromisifiedGrpcService<UserAuthService>(
      this.userServiceClient,
      'UserAuthService',
    );
    this.userProfileService = getPromisifiedGrpcService<UserProfileService>(
      this.userServiceClient,
      'UserProfileService',
    );
  }

  @Get()
  getUserProfile(@Req() req) {
    return this.userProfileService.getUserProfile({ id: req.user.id });
  }

  @Patch()
  patchUserProfile(@Req() req, @Body() body: PatchUserProfileDto) {
    return this.userProfileService.updateUserProfile({
      userId: req.user.id,
      ...body,
    });
  }

  @Delete()
  deleteUser(@Req() req) {
    return this.userAuthService.deleteOAuthUser({ id: req.user.id });
  }
}
