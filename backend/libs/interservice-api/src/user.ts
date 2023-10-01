export enum UserServiceApi {
  GENERATE_JWTS = 'generate_jwts',
  GENERATE_JWTS_FROM_REFRESH_TOKEN = 'generate_jwts_from_refresh_token',
  FIND_OR_CREATE_OAUTH_USER = 'find_or_create_oauth_user',
  DELETE_OAUTH_USER = 'delete_oauth_user',
  CREATE_USER_PROFILE = 'create_user_profile',
  GET_USER_PROFILE = 'get_user_profile',
  UPDATE_USER_PROFILE = 'update_user_profile',
}
