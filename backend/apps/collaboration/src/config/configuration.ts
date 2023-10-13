import { getRmqOptionsForQueue } from '@app/microservice/utils';
import {
  DatabaseConfigurationOptions,
  getDatabaseConfigurationForService,
} from '@app/sql-database';
import { RmqQueue } from '@app/microservice/utils';
import { Service } from '@app/microservice/interservice-api/services';

const collaborationConfiguration = () => {
  const questionServiceOptions = getRmqOptionsForQueue(RmqQueue.QUESTION);

  const databaseConfigurationOptions: DatabaseConfigurationOptions =
    getDatabaseConfigurationForService(Service.COLLABORATION_SERVICE);

  return {
    port: parseInt(process.env.COLLABORATION_SERVICE_PORT, 10),
    databaseConfigurationOptions,
    questionServiceOptions,
    rmqUrl: process.env.RMQ_URL,
  };
};

export default collaborationConfiguration;
