import { DatabaseConfigurationOptions } from '@app/sql-database';
import { getDatabaseConfigurationForService } from '@app/sql-database/config/databaseConfiguration';
import { Service } from '@app/microservice/services';

const userConfiguration = () => {
  const databaseConfigurationOptions: DatabaseConfigurationOptions =
    getDatabaseConfigurationForService(Service.USER_SERVICE);

  return {
    port: parseInt(process.env.USER_SERVICE_PORT, 10),
    databaseConfigurationOptions,
  };
};

export default userConfiguration;
