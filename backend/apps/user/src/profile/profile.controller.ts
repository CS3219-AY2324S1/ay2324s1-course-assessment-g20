import { Controller } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserProfileModel } from '../database/models/userProfile.model';

interface UpdateUserProfilePayload {
  id: string;
  body: Partial<UserProfileModel>;
}

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern('create_user_profile')
  createUserProfile(@Payload() data: Partial<UserProfileModel>) {
    console.log('create_user_profile in user service');
    const { userId, name } = data;
    return this.profileService.createUserProfile(userId, name);
  }

  @MessagePattern('get_user_profile')
  getUser(
    @Payload() id: string,
  ): Promise<Partial<UserProfileModel> | undefined> {
    return this.profileService.getUserProfile(id);
  }

  @MessagePattern('update_user_profile')
  updateUser(
    @Payload() data: UpdateUserProfilePayload,
  ): Promise<UserProfileModel> {
    const { id, body: userProfile } = data;
    return this.profileService.updateUserProfile(id, userProfile);
  }
}
