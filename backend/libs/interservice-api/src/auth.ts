export enum AuthServiceApi {
  GENERATE_JWTS = 'generate_jwts',
  GENERATE_JWTS_FROM_REFRESH_TOKEN = 'generate_jwts_from_refresh_token',
  FIND_OR_CREATE_OAUTH_USER = 'find_or_create_oauth_user',
}

export const AUTH_SERVICE = 'AUTH_SERVICE';
