import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Patch,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import PatchUserProfileDto from '../dtos/user/patchUserProfile.dto';
import { Service } from '@app/interservice-api/services';
import { UserServiceApi } from '@app/interservice-api/user';

@Controller('user')
export class UserController {
  constructor(
    @Inject(Service.USER_SERVICE)
    private readonly userServiceClient: ClientProxy,
  ) {}

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
    return this.userServiceClient.send(
      UserServiceApi.DELETE_OAUTH_USER,
      req.user.id,
    );
  }
}
