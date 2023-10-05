import { Controller } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserProfileModel } from '../database/models/userProfile.model';
import { UserServiceApi } from '@app/interservice-api/user';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern(UserServiceApi.GET_USER_PROFILE)
  getUserProfile(
    @Payload() id: string,
  ): Promise<Partial<UserProfileModel> | undefined> {
    return this.profileService.getUserProfile(id);
  }

  @MessagePattern(UserServiceApi.UPDATE_USER_PROFILE)
  updateUserProfile(
    @Payload() data: Partial<UserProfileModel>,
  ): Promise<UserProfileModel> {
    return this.profileService.updateUserProfile(data);
  }
}
