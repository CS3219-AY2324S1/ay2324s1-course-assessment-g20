export type JwtPayload = {
  id: string;
};
export type JwtTokenConfig = {
  accessTokenSecret: string;
  accessTokenExpiry: string;
  refreshTokenSecret: string;
  refreshTokenExpiry: string;
};
