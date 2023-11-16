import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { UserModel } from '../../models/user.model';
import { DEFAULT_LANGUAGE } from '@app/types/languages';

@Injectable()
export class UserDaoService {
  static allGraphs = `[${Object.keys(UserModel.relationMappings())}]`;

  constructor(@Inject('UserModel') private userModel: ModelClass<UserModel>) {}

  async createUser(user: Partial<UserModel>) {
    return await this.userModel.query().insertGraph({
      ...user,
      userProfile: {
        name: user.name,
        username: null,
        preferredLanguageId: DEFAULT_LANGUAGE,
      },
    });
  }

  deleteUser(id: string) {
    return this.userModel.query().deleteById(id);
  }
}
