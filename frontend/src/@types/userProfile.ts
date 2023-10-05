export type Role = {
  id: number;
  name: string;
};

export type Language = {
  id: number;
  name: string;
};

export type UserProfile = {
  name?: string;
  preferredLanguage?: Language;
  role?: Role;
};

export type UpdateUserProfile = {
  name?: string;
  preferredLanguageId?: number;
  roleId?: number;
};
