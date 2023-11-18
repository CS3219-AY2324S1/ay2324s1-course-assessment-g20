import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { UserModel } from '../../models/user.model';

@Injectable()
export class UserDaoService {
  static allGraphs = `[${Object.keys(UserModel.relationMappings())}]`;

  constructor(@Inject('UserModel') private userModel: ModelClass<UserModel>) {}

  async findOrCreateOAuthUser(user: Partial<UserModel>) {
    const { authProviderId, authProvider } = user;

    const existingEntry = await this.userModel
      .query()
      .findOne({
        authProviderId,
        authProvider,
      })
      .withGraphFetched(UserDaoService.allGraphs);

    if (existingEntry) {
      return existingEntry;
    }

    return await this.userModel.query().insertGraph(user);
  }

  async deleteOAuthUser(id: string) {
    return await this.userModel.query().deleteById(id);
  }

  findByIds(userIds: string[]) {
    return this.userModel.query().findByIds(userIds);
  }
}
