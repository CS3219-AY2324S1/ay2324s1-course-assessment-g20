import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { UserModel } from '../../models/user.model';

@Injectable()
export class UserDaoService {
  constructor(@Inject('UserModel') private userModel: ModelClass<UserModel>) {}

  async findOrCreateOAuthUser(user: Partial<UserModel>) {
    const { authProviderId, authProvider } = user;

    const existingEntry = await this.userModel.query().findOne({
      authProviderId,
      authProvider,
    });

    if (existingEntry) {
      return existingEntry;
    }

    return await this.userModel.query().insertGraph(user);
  }

  async findOAuthUser(user: Partial<UserModel>) {
    const { authProviderId, authProvider } = user;

    return await this.userModel.query().findOne({
      authProviderId,
      authProvider,
    });
  }

  async createOAuthUser(user: Partial<UserModel>) {
    return await this.userModel.query().insertGraph(user);
  }
}
