export type JwtPayload = {
  id: string;
  roleId: number;
};
export type JwtTokenConfig = {
  accessTokenSecret: string;
  accessTokenExpiry: string;
  refreshTokenSecret: string;
  refreshTokenExpiry: string;
};
