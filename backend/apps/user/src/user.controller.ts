import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserProfileModel } from './database/models/userProfile.model';

interface UpdateUserProfilePayload {
  id: string;
  body: Partial<UserProfileModel>;
}

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('get_user_profile')
  getUser(@Payload() id: string): Promise<Partial<UserProfileModel> | undefined> {
    return this.userService.getUserProfile(id);
  }

  @MessagePattern('update_user_profile')
  updateUser(@Payload() data: UpdateUserProfilePayload): Promise<UserProfileModel> {
    const { id, body: userProfile } = data;
    return this.userService.updateUserProfile(id, userProfile);
  }
}
