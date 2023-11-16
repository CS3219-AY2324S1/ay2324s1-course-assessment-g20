import { Injectable } from '@nestjs/common';
import { UserDaoService } from '../database/daos/users/user.dao.service';
import { User } from '@app/microservice/interfaces/user';

@Injectable()
export class AuthService {
  constructor(private readonly userDaoService: UserDaoService) {}

  createUser(name: string): Promise<User> {
    return this.userDaoService.createUser(name);
  }

  deleteUser(id: string) {
    return this.userDaoService.deleteUser(id);
  }
}
