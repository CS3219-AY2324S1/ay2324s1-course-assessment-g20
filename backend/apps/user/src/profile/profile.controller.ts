import { Controller } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { GrpcMethod } from '@nestjs/microservices';
import { UserProfileModel } from '../database/models/userProfile.model';

const UserProfileServiceGrpcMethod: MethodDecorator =
  GrpcMethod('UserProfileService');

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UserProfileServiceGrpcMethod
  getUserProfile({
    id,
  }: {
    id: string;
  }): Promise<Partial<UserProfileModel> | undefined> {
    return this.profileService.getUserProfile(id);
  }

  @UserProfileServiceGrpcMethod
  updateUserProfile(
    data: Partial<UserProfileModel>,
  ): Promise<UserProfileModel> {
    return this.profileService.updateUserProfile(data);
  }
}
