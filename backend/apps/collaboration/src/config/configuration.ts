import {
  DatabaseConfigurationOptions,
  getDatabaseConfigurationForService,
} from '@app/sql-database';
import { Service } from '@app/microservice/interservice-api/services';

const collaborationConfiguration = () => {
  const databaseConfigurationOptions: DatabaseConfigurationOptions =
    getDatabaseConfigurationForService(Service.COLLABORATION_SERVICE);

  return {
    port: parseInt(process.env.COLLABORATION_SERVICE_PORT, 10),
    databaseConfigurationOptions,
    rmqUrl: process.env.RMQ_URL,
  };
};

export default collaborationConfiguration;
