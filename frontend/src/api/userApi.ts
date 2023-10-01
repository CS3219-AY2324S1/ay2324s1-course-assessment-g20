import { UpdateUserProfile } from '../@types/UpdateUserProfile';
import { backendServicesPaths, HttpRequestMethod } from '../utils/constants';
import { requestBackend } from './requestBackend';

export async function getUserProfile() {
  return requestBackend({
    url: backendServicesPaths.user.root,
    method: HttpRequestMethod.GET,
  });
}

export async function updateUserProfile(updatedProfile: UpdateUserProfile) {
  return requestBackend({
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
  return requestBackend({
    url: backendServicesPaths.languages.root,
    method: HttpRequestMethod.GET,
  });
}
