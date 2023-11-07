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

    if (!matchingEntry || matchingEntry.userId === matchEntry.userId) {
      return null;
    }

    return matchingEntry;
  }

  async updateMatchingEntryIfExist(matchEntry: LookingToMatchModel) {
    const { userId } = matchEntry;
    const existingEntry = await this.getEntryByUserId(userId);

    if (!existingEntry) {
      return;
    }

    this.deleteEntryByUserId(userId);
    this.storeEntry(matchEntry);
  }

  async createOrUpdateMatchingEntry(matchEntry: LookingToMatchModel) {
    await this.deleteEntryByUserId(matchEntry.userId);
    await this.storeEntry(matchEntry);
  }

  async deleteMatchingEntryIfExists(matchEntry: LookingToMatchModel) {
    this.deleteEntryByUserId(matchEntry.userId);
  }

  private async storeEntry(matchEntry: LookingToMatchModel) {
    const { userId, questionDifficulty } = matchEntry;

    await this.cacheManager.set(this.generateUserKey(userId), matchEntry);
    await this.cacheManager.set(
      this.generateDifficultyKey(questionDifficulty),
      matchEntry,
    );
  }

  async deleteEntryByUserId(userId: string) {
    const entry = await this.cacheManager.get<LookingToMatchModel>(
      this.generateUserKey(userId),
    );

    if (!entry) {
      return;
    }
    await this.cacheManager.del(this.generateUserKey(userId));
    await this.cacheManager.del(
      this.generateDifficultyKey(entry.questionDifficulty),
    );
  }

  private async getEntryByUserId(userId: string) {
    return await this.cacheManager.get<LookingToMatchModel>(
      this.generateUserKey(userId),
    );
  }

  private async getEntryByDifficulty(difficulty: string) {
    return await this.cacheManager.get<LookingToMatchModel>(
      this.generateDifficultyKey(difficulty),
    );
  }

  private generateUserKey(userId: string) {
    return 'user' + userId;
  }

  private generateDifficultyKey(difficulty: string) {
    return 'difficulty' + difficulty;
  }
}
