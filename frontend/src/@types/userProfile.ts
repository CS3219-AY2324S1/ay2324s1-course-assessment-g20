import { Language } from './language';

export type UserProfile = {
  name: string;
  preferredLanguageId: number;
  preferredLanguage: Language;
  username: string;
};

export type UpdateUserProfile = {
  name?: string;
  username?: string;
  preferredLanguageId?: number;
};

export interface IProfileContext {
  name: string;
  username: string;
  preferredLanguageId: number;
  preferredLanguage: string;
  isOnboarded: boolean;
  isLoading: boolean;
  updateProfile: (newProfile: UpdateUserProfile) => Promise<UserProfile>;
  deleteProfile: () => Promise<void>;
}
