import {
  DatabaseConfigurationOptions,
  getDatabaseConfigurationForService,
} from '@app/sql-database';
import { Service } from '@app/microservice/services';

const collaborationConfiguration = () => {
  const databaseConfigurationOptions: DatabaseConfigurationOptions =
    getDatabaseConfigurationForService(Service.COLLABORATION_SERVICE);

  return {
    port: parseInt(process.env.COLLABORATION_SERVICE_PORT, 10),
    mongoUri: process.env.COLLABORATION_SERVICE_MONGODB_URL,
    databaseConfigurationOptions,
  };
};

export default collaborationConfiguration;
