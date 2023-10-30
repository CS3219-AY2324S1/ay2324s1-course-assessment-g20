import { Service } from '@app/microservice/services';
import {
  DatabaseConfigurationOptions,
  getDatabaseConfigurationForService,
} from '@app/sql-database';

const historyConfiguration = () => {
  const databaseConfigurationOptions: DatabaseConfigurationOptions =
    getDatabaseConfigurationForService(Service.HISTORY_SERVICE);
  return {
    port: parseInt(process.env.HISTORY_SERVICE_PORT, 10),
    databaseConfigurationOptions,
  };
};

export default historyConfiguration;
