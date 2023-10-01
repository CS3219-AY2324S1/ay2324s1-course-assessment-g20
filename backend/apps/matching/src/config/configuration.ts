import { DatabaseConfigurationOptions } from '@app/sql-database';
import { RmqQueue } from '@app/types/rmqQueues';
import { RmqOptions, Transport } from '@nestjs/microservices';

export default function matchingConfiguration() {
  const databaseConfigurationOptions: DatabaseConfigurationOptions = {
    host: process.env.MATCHING_SERVICE_SQL_DATABASE_HOST,
    port: process.env.MATCHING_SERVICE_SQL_DATABASE_PORT,
    user: process.env.MATCHING_SERVICE_SQL_DATABASE_USER,
    password: process.env.MATCHING_SERVICE_SQL_DATABASE_PASSWORD,
    database: process.env.MATCHING_SERVICE_SQL_DATABASE_NAME,
  };
  const rmqUrl = process.env.RMQ_URL;

  const getRmqOptions = (rmqQueue: RmqQueue): RmqOptions => ({
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: rmqQueue,
    },
  });

  const websocketServiceOptions = getRmqOptions(RmqQueue.WEBSOCKET);

  return {
    port: parseInt(process.env.MATCHING_SERVICE_PORT, 10),
    databaseConfigurationOptions,
    rmqUrl: process.env.RMQ_URL,
    websocketServiceOptions,
  };
}
