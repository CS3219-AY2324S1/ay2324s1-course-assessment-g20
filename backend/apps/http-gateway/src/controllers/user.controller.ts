import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Patch,
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

  @Get(':userId')
  getUserProfile(@Param() params) {
    return this.userProfileService.getUserProfileById({ id: params.userId });
  }

  @Get('/username/:username')
  getSpecifiedUserProfile(@Param() params) {
    return this.userProfileService.getUserProfileByUsername({
      username: params.username,
    });
  }

  @Patch(':userId')
  patchUserProfile(@Param() params, @Body() body: PatchUserProfileDto) {
    return this.userProfileService.updateUserProfile({
      userId: params.userId,
      ...body,
    });
  }

  @Delete(':userId')
  deleteUser(@Param() params) {
    return this.userAuthService.deleteUser({ id: params.userId });
  }
}
