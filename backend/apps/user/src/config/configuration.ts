import { DatabaseConfigurationOptions } from '@app/sql-database';
import { JwtTokenConfig } from '@app/types';
import { getDatabaseConfigurationForService } from '@app/sql-database/config/databaseConfiguration';
import { Service } from '@app/microservice/services';

const userConfiguration = () => {
  const jwtTokenConfig: JwtTokenConfig = {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,
  };
  const databaseConfigurationOptions: DatabaseConfigurationOptions =
    getDatabaseConfigurationForService(Service.USER_SERVICE);

  return {
    port: parseInt(process.env.USER_SERVICE_PORT, 10),
    jwtTokenConfig,
    databaseConfigurationOptions,
  };
};

export default userConfiguration;
