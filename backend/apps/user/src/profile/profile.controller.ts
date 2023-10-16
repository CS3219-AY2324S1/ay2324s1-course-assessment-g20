import { Controller } from '@nestjs/common';
import { ProfileService } from './profile.service';
import {
  UserProfile,
  UserProfileServiceController,
  UserProfileServiceControllerMethods,
} from '@app/microservice/interfaces/user';
import { ID } from '@app/microservice/interfaces/common';

@Controller()
@UserProfileServiceControllerMethods()
export class ProfileController implements UserProfileServiceController {
  constructor(private readonly profileService: ProfileService) {}

  getUserProfile({ id }: ID) {
    return this.profileService.getUserProfile(id);
  }

  updateUserProfile(data: UserProfile) {
    return this.profileService.updateUserProfile(data);
  }
}
