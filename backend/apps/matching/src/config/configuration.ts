import { getRmqOptionsForQueue, RmqQueue } from '@app/microservice/utils';
import { DatabaseConfigurationOptions } from '@app/sql-database';

export default function matchingConfiguration() {
  const databaseConfigurationOptions: DatabaseConfigurationOptions = {
    host: process.env.MATCHING_SERVICE_SQL_DATABASE_HOST,
    port: process.env.MATCHING_SERVICE_SQL_DATABASE_PORT,
    user: process.env.MATCHING_SERVICE_SQL_DATABASE_USER,
    password: process.env.MATCHING_SERVICE_SQL_DATABASE_PASSWORD,
    database: process.env.MATCHING_SERVICE_SQL_DATABASE_NAME,
  };

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
    rmqUrl: process.env.RMQ_URL,
    websocketServiceOptions,
  };
}
