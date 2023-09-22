import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import PatchUserProfileDto from './dtos/patchUserProfile.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('get_hello')
  getHello(): string {
    return this.userService.getHello();
  }

  @MessagePattern('get_user_profile')
  getUser(): string {
    return this.userService.getUserProfile();
  }

  @MessagePattern('update_user_profile')
  updateUser(userProfile: Partial<PatchUserProfileDto>): string {
    return this.userService.updateUserProfile();
  }
}
