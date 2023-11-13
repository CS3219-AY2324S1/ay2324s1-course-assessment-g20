import { Language } from './language';
import { Role } from './role';

export type UserProfile = {
  name: string;
  preferredLanguageId: number;
  preferredLanguage: Language;
  roleId: number;
  role: Role;
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
  roleId: number;
  isMaintainer: boolean;
  isOnboarded: boolean;
  isLoading: boolean;
  updateProfile: (newProfile: UpdateUserProfile) => Promise<UserProfile>;
  deleteProfile: () => Promise<void>;
}
