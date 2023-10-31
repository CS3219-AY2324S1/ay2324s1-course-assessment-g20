import { User, UserProfile } from "@app/microservice/interfaces/user";
import { JwtPayload } from "@app/types";
import { Language } from "@app/types/languages";
import { Role } from "@app/types/roles";

export const MOCK_ADMIN_USER_UUID = '4394cce2-7f04-41f2-8ade-8b21cad1cb20';
export const MOCK_ADMIN_NAME = 'Alice Tan';
export const MOCK_ADMIN_USERNAME = 'alicetan';
export const MOCK_ADMIN_USER_EMAIL = 'alicetan@gmail.com';
export const MOCK_ADMIN_USER_OAUTH_ID = 'random-oauth-id-1';

export const MOCK_USER_1_UUID = '030eeafc-26cc-4e16-8467-f55b818689fa';
export const MOCK_USER_1_NAME = 'Bob Lim';
export const MOCK_USER_1_USERNAME = 'boblim';
export const MOCK_USER_1_EMAIL = 'boblim@gmail.com';
export const MOCK_USER_1_OAUTH_ID = 'random-oauth-id-2';

export const MOCK_AUTH_PROVIDER = 'test_provider';

export const MOCK_ADMIN_USER_PROFILE: UserProfile = {
  userId: MOCK_ADMIN_USER_UUID,
  name: MOCK_ADMIN_NAME,
  username: MOCK_ADMIN_USERNAME,
  preferredLanguageId: Language.JAVASCRIPT,
  roleId: Role.MAINTAINER,
};

export const MOCK_USER_1_PROFILE: UserProfile = {
  userId: MOCK_USER_1_UUID,
  name: MOCK_USER_1_NAME,
  username: MOCK_USER_1_USERNAME,
  preferredLanguageId: Language.TYPESCRIPT,
  roleId: Role.REGULAR,
};

export const MOCK_ADMIN_USER: User = {
  id: MOCK_ADMIN_USER_UUID,
  authProvider: MOCK_AUTH_PROVIDER,
  authProviderId: MOCK_ADMIN_USER_OAUTH_ID,
  oauthName: MOCK_ADMIN_NAME,
  email: MOCK_ADMIN_USER_EMAIL,
  userProfile: MOCK_ADMIN_USER_PROFILE,
};

export const MOCK_USER_1: User = {
  id: MOCK_USER_1_UUID,
  authProvider: MOCK_AUTH_PROVIDER,
  authProviderId: MOCK_USER_1_OAUTH_ID,
  oauthName: MOCK_USER_1_NAME,
  email: MOCK_USER_1_EMAIL,
  userProfile: MOCK_USER_1_PROFILE,
};

export const MOCK_ADMIN_USER_JWT_PAYLOAD: JwtPayload = {
  id: MOCK_ADMIN_USER_UUID,
};

export const MOCK_USER_1_JWT_PAYLOAD: JwtPayload = {
  id: MOCK_USER_1_UUID,
};
