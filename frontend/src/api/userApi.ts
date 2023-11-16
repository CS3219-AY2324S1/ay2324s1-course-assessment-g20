import { UpdateUserProfile, UserProfile } from '../@types/userProfile';
import { Language } from '../@types/language';
import { backendServicesPaths, HttpRequestMethod } from '../utils/constants';
import { requestBackend } from './requestBackend';

export async function getUserProfile(userId: string) {
  return requestBackend<UserProfile>({
    url: `${backendServicesPaths.user.root}/${userId}`,
    method: HttpRequestMethod.GET,
  });
}

export async function getUserProfileByUsername(username: string) {
  return requestBackend<UserProfile>({
    url: `${backendServicesPaths.user.root}/username/${username}`,
    method: HttpRequestMethod.GET,
  });
}

export async function updateUserProfile(userId: string, updatedProfile: UpdateUserProfile) {
  return requestBackend<UserProfile>({
    url: `${backendServicesPaths.user.root}/${userId}`,
    method: HttpRequestMethod.PATCH,
    data: updatedProfile,
  });
}

export async function deleteUserProfile(userId: string) {
  return requestBackend({
    url: `${backendServicesPaths.user.root}/${userId}`,
    method: HttpRequestMethod.DELETE,
  });
}

export async function getAllLanguages() {
  return requestBackend<Language[]>({
    url: backendServicesPaths.languages.root,
    method: HttpRequestMethod.GET,
  });
}
