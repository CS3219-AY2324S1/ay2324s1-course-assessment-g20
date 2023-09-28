import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { UserProfileModel } from '../../models/userProfile.model';

@Injectable()
export class UserProfileDaoService {
  static allGraphs = `[${Object.keys(UserProfileModel.relationMappings())}]`;

  constructor(
    @Inject('UserProfileModel')
    private readonly userProfileModel: ModelClass<UserProfileModel>,
  ) {}

  createUser(
    userId: string,
    name: string,
    roleId = 2,
    preferredLanguageId = 1,
  ) {
    // return this.userProfileModel.query().insert({ userId, name, roleId, preferredLanguageId });
    const result = this.userProfileModel
      .query()
      .insert({ userId, name, roleId, preferredLanguageId });
    console.log('createUser in userProfile.dao.service'), result;
    return result;
  }

  findByUserId({
    userId,
    select,
    withGraphFetched,
  }: {
    userId: string;
    select?: string | string[];
    withGraphFetched?: boolean;
  }) {
    let query = this.userProfileModel.query().where({ userId });

    if (select) {
      query = query.select(select);
    }

    if (withGraphFetched) {
      query = query.withGraphFetched(UserProfileDaoService.allGraphs);
    }

    return query.first().then((profile) => {
      if (!profile) {
        throw new HttpException('User does not exist!', 400);
      }
      /**
       * Favouring this method of removing id instead of selecting columns
       * to prevent accidentally forgetting to update the select query when adding
       * new columns in the future.
       */
      const profileWithoutId = { ...profile };
      delete profileWithoutId.id;
      return profileWithoutId;
    });
  }

  updateByUserId(userId: string, data: Partial<UserProfileModel>) {
    return this.userProfileModel
      .query()
      .patch(data)
      .where({ userId })
      .returning('*')
      .withGraphFetched(UserProfileDaoService.allGraphs)
      .first();
  }
}
