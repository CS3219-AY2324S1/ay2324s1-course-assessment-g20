import { Language } from "./language";
import { Role } from "./role";

export type UserProfile = {
  name: string;
  preferredLanguage: Language;
  role: Role;
};

export type UpdateUserProfile = {
  name?: string;
  preferredLanguageId?: number;
  roleId?: number;
};

export interface IProfileContext {
  name: string;
  preferredLanguageId: number;
  roleId: number;
  isMaintainer: boolean;
  updateProfile: (newProfile: UpdateUserProfile) => void;
}