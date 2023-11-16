import { Injectable } from '@nestjs/common';
import { UserDaoService } from '../database/daos/users/user.dao.service';
import { UserModel } from '../database/models/user.model';

@Injectable()
export class AuthService {
  constructor(private readonly userDaoService: UserDaoService) {}
  findOrCreateOAuthUser(user: Partial<UserModel>) {
    return this.userDaoService.findOrCreateOAuthUser(user);
  }

  deleteOAuthUser(id: string) {
    return this.userDaoService.deleteOAuthUser(id);
  }
}
