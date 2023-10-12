import { Service } from '@app/microservice/interservice-api/services';
import { getRmqOptionsForQueue, RmqQueue } from '@app/microservice/utils';
import {
  DatabaseConfigurationOptions,
  getDatabaseConfigurationForService,
} from '@app/sql-database';

export default function matchingConfiguration() {
  const databaseConfigurationOptions: DatabaseConfigurationOptions =
    getDatabaseConfigurationForService(Service.MATCHING_SERVICE);

  const websocketServiceOptions = getRmqOptionsForQueue(RmqQueue.WEBSOCKET);
  const collaborationServiceOptions = getRmqOptionsForQueue(
    RmqQueue.COLLABORATION,
  );
  const questionServiceOptions = getRmqOptionsForQueue(RmqQueue.QUESTION);

  return {
    port: parseInt(process.env.MATCHING_SERVICE_PORT, 10),
    databaseConfigurationOptions,
    collaborationServiceOptions,
    questionServiceOptions,
    websocketServiceOptions,
  };
}
