import { Controller } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserProfileModel } from '../database/models/userProfile.model';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern('get_user_profile')
  getUserProfile(
    @Payload() id: string,
  ): Promise<Partial<UserProfileModel> | undefined> {
    return this.profileService.getUserProfile(id);
  }

  @MessagePattern('update_user_profile')
  updateUserProfile(
    @Payload() data: Partial<UserProfileModel>,
  ): Promise<UserProfileModel> {
    const { userId } = data;
    const userProfile = { ...data };
    delete userProfile.userId;
    return this.profileService.updateUserProfile(userId, userProfile);
  }
}
