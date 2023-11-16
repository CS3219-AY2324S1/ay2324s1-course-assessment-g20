import { UpdateUserProfile, UserProfile } from '../@types/userProfile';
import { Language } from '../@types/language';
import { backendServicesPaths, HttpRequestMethod } from '../utils/constants';
import { requestBackend } from './requestBackend';
import { IAttempt } from '../@types/history';

export async function getUserProfile() {
  return requestBackend<UserProfile>({
    url: backendServicesPaths.user.root,
    method: HttpRequestMethod.GET,
  });
}

export async function getUserProfileByUsername(username: string) {
  return requestBackend<UserProfile>({
    url: `${backendServicesPaths.user.root}/username/${username}`,
    method: HttpRequestMethod.GET,
  });
}

export async function updateUserProfile(updatedProfile: UpdateUserProfile) {
  return requestBackend<UserProfile>({
    url: backendServicesPaths.user.root,
    method: HttpRequestMethod.PATCH,
    data: updatedProfile,
  });
}

export async function deleteUserProfile() {
  return requestBackend({
    url: backendServicesPaths.user.root,
    method: HttpRequestMethod.DELETE,
  });
}

export async function getAllLanguages() {
  return requestBackend<Language[]>({
    url: backendServicesPaths.languages.root,
    method: HttpRequestMethod.GET,
  });
}

export async function getUserAttempts() {
  return requestBackend<IAttempt[]>({
    url: backendServicesPaths.user.userAttempts,
    method: HttpRequestMethod.GET,
  });
}
