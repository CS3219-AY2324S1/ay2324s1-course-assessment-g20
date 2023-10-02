import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { LookingToMatchModel } from '../../models/lookingToMatch.model';

@Injectable()
export class LookingToMatchDaoService {
  constructor(
    @Inject('LookingToMatchModel')
    private lookingToMatchModel: ModelClass<LookingToMatchModel>,
  ) {}
  async findMatchingEntry(matchEntry: Partial<LookingToMatchModel>) {
    return await this.lookingToMatchModel
      .query()
      .select()
      .whereNot('userId', matchEntry.userId)
      .where('questionDifficulty', matchEntry.questionDifficulty)
      .where('isConnected', true)
      .orderBy('updatedAt', 'asc')
      .first();
  }

  async updateMatchingEntryIfExist(matchEntry: Partial<LookingToMatchModel>) {
    const { userId } = matchEntry;
    const existingEntry = await this.lookingToMatchModel.query().findOne({
      userId,
    });

    if (existingEntry) {
      await this.lookingToMatchModel
        .query()
        .update(matchEntry)
        .where('userId', userId)
        .execute();
    }
  }

  async createOrUpdateMatchingEntry(matchEntry: Partial<LookingToMatchModel>) {
    const { userId } = matchEntry;

    const existingEntry = await this.lookingToMatchModel.query().findOne({
      userId,
    });

    if (existingEntry) {
      await this.lookingToMatchModel
        .query()
        .update({ isConnected: true })
        .where('userId', userId)
        .execute();
      return;
    }

    await this.lookingToMatchModel
      .query()
      .insert({ isConnected: true, ...matchEntry })
      .execute();
  }

  async deleteMatchingEntry(matchEntry: Partial<LookingToMatchModel>) {
    const { userId } = matchEntry;
    await this.lookingToMatchModel
      .query()
      .delete()
      .where('userId', userId)
      .execute();
  }
}
