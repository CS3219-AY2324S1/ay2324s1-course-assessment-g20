import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import PatchUserProfileDto from '../dtos/user/patchUserProfile.dto';

@Controller('user')
export class UserController {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userServiceClient: ClientProxy,
  ) {}

  @Get()
  async getUserProfile(@Req() req) {
    return this.userServiceClient.send('get_user_profile', { id: req.user.id });
  }

  @Patch()
  async patchUserProfile(@Req() req, @Body() body: PatchUserProfileDto) {
    return await this.userServiceClient.send('patch_user_profile', { id: req.user.id, body });
  }
}
