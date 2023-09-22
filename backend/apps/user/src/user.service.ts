import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getHello(): string {
    console.log('responding to hello request');
    return 'Hello World!';
  }

  getUserProfile(): string {
    console.log('responding to get user request');
    return 'Get User!';
  }

  updateUserProfile(): string {
    console.log('responding to update user request');
    return 'Update User!';
  }
}
