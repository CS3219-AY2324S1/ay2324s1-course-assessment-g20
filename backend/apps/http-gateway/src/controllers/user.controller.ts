import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Patch,
  Req,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import PatchUserProfileDto from '../dtos/user/patchUserProfile.dto';
import { Service } from '@app/microservice/services';
import {
  USER_AUTH_SERVICE_NAME,
  USER_PROFILE_SERVICE_NAME,
  UserAuthServiceClient,
  UserProfileServiceClient,
} from '@app/microservice/interfaces/user';

@Controller('user')
export class UserController implements OnModuleInit {
  private userAuthService: UserAuthServiceClient;
  private userProfileService: UserProfileServiceClient;

  constructor(
    @Inject(Service.USER_SERVICE) private userServiceClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userAuthService =
      this.userServiceClient.getService<UserAuthServiceClient>(
        USER_AUTH_SERVICE_NAME,
      );
    this.userProfileService =
      this.userServiceClient.getService<UserProfileServiceClient>(
        USER_PROFILE_SERVICE_NAME,
      );
  }

  @Get()
  getUserProfile(@Req() req) {
    return this.userProfileService.getUserProfileById({ id: req.user.id });
  }

  @Get('/username/:username')
  getSpecifiedUserProfile(@Param() params) {
    return this.userProfileService.getUserProfileByUsername({
      username: params.username,
    });
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
