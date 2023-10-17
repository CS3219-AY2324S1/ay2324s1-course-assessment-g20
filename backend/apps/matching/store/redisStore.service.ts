import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { LookingToMatchModel } from './models';

@Injectable()
export class RedisStoreService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async findMatchingEntry(matchEntry: LookingToMatchModel) {
    const matchingEntry = await this.getEntryByDifficulty(
      matchEntry.questionDifficulty,
    );

    if (!matchingEntry) {
      return null;
    }

    if (matchingEntry.userId !== matchEntry.userId) {
      return matchingEntry;
    }

    return null;
  }

  async updateMatchingEntryIfExist(matchEntry: LookingToMatchModel) {
    const { userId } = matchEntry;
    const existingEntry = await this.getEntryByUserId(userId);

    if (existingEntry) {
      this.deleteEntryByUserId(userId);
      this.storeEntry(matchEntry);
    }
  }

  async createOrUpdateMatchingEntry(matchEntry: LookingToMatchModel) {
    this.deleteEntryByUserId(matchEntry.userId);
    this.storeEntry(matchEntry);
  }

  async deleteMatchingEntry(matchEntry: LookingToMatchModel) {
    this.deleteEntryByUserId(matchEntry.userId);
  }

  private async storeEntry(matchEntry: LookingToMatchModel) {
    const { userId, questionDifficulty } = matchEntry;

    await this.cacheManager.set(this.getUserKey(userId), matchEntry);
    await this.cacheManager.set(
      this.getDifficultyKey(questionDifficulty),
      matchEntry,
    );
  }

  async deleteEntryByUserId(userId: string) {
    const entry = await this.cacheManager.get<LookingToMatchModel>(
      this.getUserKey(userId),
    );

    if (!entry) {
      return;
    }
    await this.cacheManager.del(this.getUserKey(userId));
    await this.cacheManager.del(
      this.getDifficultyKey(entry.questionDifficulty),
    );
  }

  private async getEntryByUserId(userId: string) {
    return await this.cacheManager.get<LookingToMatchModel>(
      this.getUserKey(userId),
    );
  }

  private async getEntryByDifficulty(difficulty: string) {
    return await this.cacheManager.get<LookingToMatchModel>(
      this.getDifficultyKey(difficulty),
    );
  }

  private getUserKey(userId: string) {
    return 'user' + userId;
  }

  private getDifficultyKey(difficulty: string) {
    return 'difficulty' + difficulty;
  }
}
