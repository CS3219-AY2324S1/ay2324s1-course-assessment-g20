import { User, UserProfile } from '@app/microservice/interfaces/user';
import { Language } from '@app/types/languages';

export const MOCK_ADMIN_USER_UUID = '4394cce2-7f04-41f2-8ade-8b21cad1cb20';
export const MOCK_ADMIN_NAME = 'Alice Tan';
export const MOCK_ADMIN_USERNAME = 'alicetan';

export const MOCK_USER_1_UUID = '030eeafc-26cc-4e16-8467-f55b818689fa';
export const MOCK_USER_1_NAME = 'Bob Lim';
export const MOCK_USER_1_USERNAME = 'boblim';

export const MOCK_USER_2_UUID = '05e92f24-6a09-4105-be51-c668cfe9ed38';
export const MOCK_USER_2_NAME = 'Charles Lee';
export const MOCK_USER_2_USERNAME = 'charlie';

export const MOCK_USER_1_PROFILE: UserProfile = {
  userId: MOCK_USER_1_UUID,
  name: MOCK_USER_1_NAME,
  username: MOCK_USER_1_USERNAME,
  preferredLanguageId: Language.TYPESCRIPT,
  preferredLanguage: {
    id: Language.TYPESCRIPT,
    name: Language[Language.TYPESCRIPT],
  },
};

export const MOCK_USER_2_PROFILE: UserProfile = {
  userId: MOCK_USER_2_UUID,
  name: MOCK_USER_2_NAME,
  username: MOCK_USER_2_USERNAME,
  preferredLanguageId: Language.JAVASCRIPT,
  preferredLanguage: {
    id: Language.JAVASCRIPT,
    name: Language[Language.JAVASCRIPT],
  },
};

export const MOCK_USER_1: User = {
  id: MOCK_USER_1_UUID,
  name: MOCK_USER_1_NAME,
  userProfile: MOCK_USER_1_PROFILE,
};

export const MOCK_USER_2: User = {
  id: MOCK_USER_2_UUID,
  name: MOCK_USER_2_NAME,
  userProfile: MOCK_USER_2_PROFILE,
};
