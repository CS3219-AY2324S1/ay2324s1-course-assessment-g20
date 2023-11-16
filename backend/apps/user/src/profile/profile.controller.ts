import { Controller } from '@nestjs/common';
import { ProfileService } from './profile.service';
import {
  UserProfile,
  UserProfileServiceController,
  UserProfileServiceControllerMethods,
  Username,
} from '@app/microservice/interfaces/user';
import { ID } from '@app/microservice/interfaces/common';

@Controller()
@UserProfileServiceControllerMethods()
export class ProfileController implements UserProfileServiceController {
  constructor(private readonly profileService: ProfileService) {}

  getUserProfileById({ id }: ID) {
    return this.profileService.getUserProfileById(id);
  }

  getUserProfileByUsername({ username }: Username) {
    return this.profileService.getUserProfileByUsername(username);
  }

  updateUserProfile(data: UserProfile) {
    return this.profileService.updateUserProfile(data);
  }
}
