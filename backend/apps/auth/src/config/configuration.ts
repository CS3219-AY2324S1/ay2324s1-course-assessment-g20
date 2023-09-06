export type JwtTokenConfig = {
  accessTokenSecret: string;
  accessTokenExpiry: string;
  refreshTokenSecret: string;
  refreshTokenExpiry: string;
};

const jwtTokenConfig: JwtTokenConfig = {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,
};

const authConfiguration = () => ({
  port: parseInt(process.env.AUTH_SERVICE_PORT, 10),
  jwtTokenConfig,
});

export default authConfiguration;
