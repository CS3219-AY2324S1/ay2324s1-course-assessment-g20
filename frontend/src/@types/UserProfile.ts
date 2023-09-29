import { Language } from './Language';
import { Role } from './Role';

export type UserProfile = {
  name?: string;
  preferredLanguage?: Language;
  role?: Role;
};
