import { DatabaseConfigurationOptions } from '@app/sql-database';
import { JwtTokenConfig } from '@app/types';

const userConfiguration = () => {
  const jwtTokenConfig: JwtTokenConfig = {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,
  };

  const databaseConfigurationOptions: DatabaseConfigurationOptions = {
    host: process.env.USER_SERVICE_SQL_DATABASE_HOST,
    port: process.env.USER_SERVICE_SQL_DATABASE_PORT,
    user: process.env.USER_SERVICE_SQL_DATABASE_USER,
    password: process.env.USER_SERVICE_SQL_DATABASE_PASSWORD,
    database: process.env.USER_SERVICE_SQL_DATABASE_NAME,
  };

  return {
    port: parseInt(process.env.USER_SERVICE_PORT, 10),
    jwtTokenConfig,
    databaseConfigurationOptions,
  };
};

export default userConfiguration;
