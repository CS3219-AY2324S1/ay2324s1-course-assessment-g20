import { Body, Controller, Get, Inject, Patch, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import PatchUserProfileDto from '../dtos/user/patchUserProfile.dto';
import { firstValueFrom } from 'rxjs';
import { Service } from '@app/interservice-api/services';

@Controller('user')
export class UserController {
  constructor(
    @Inject(Service.USER_SERVICE)
    private readonly userServiceClient: ClientProxy,
  ) {}

  @Get()
  async getUserProfile(@Req() req) {
    const userProfile = await firstValueFrom(
      this.userServiceClient.send('get_user_profile', req.user.id),
    ).then((profile) => ({
      name: profile.name,
      preferredLanguage: profile.preferredLanguage,
      role: profile.role,
    }));
    return userProfile;
  }

  @Patch()
  async patchUserProfile(@Req() req, @Body() body: PatchUserProfileDto) {
    return await firstValueFrom(
      this.userServiceClient.send('update_user_profile', {
        userId: req.user.id,
        ...body,
      }),
    );
  }
}
