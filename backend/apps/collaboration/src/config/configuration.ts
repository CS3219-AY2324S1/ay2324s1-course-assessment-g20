import { DatabaseConfigurationOptions } from '@app/sql-database';
import { RmqQueue } from '@app/types/rmqQueues';
import { RmqOptions, Transport } from '@nestjs/microservices';

const collaborationConfiguration = () => {
  const rmqUrl = process.env.RMQ_URL;
  const getRmqOptions = (rmqQueue: RmqQueue): RmqOptions => ({
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: rmqQueue,
    },
  });

  const authServiceOptions = getRmqOptions(RmqQueue.AUTH);
  const questionServiceOptions = getRmqOptions(RmqQueue.QUESTION);

  const databaseConfigurationOptions: DatabaseConfigurationOptions = {
    host: process.env.COLLABORATION_SERVICE_SQL_DATABASE_HOST,
    port: process.env.COLLABORATION_SERVICE_SQL_DATABASE_PORT,
    user: process.env.COLLABORATION_SERVICE_SQL_DATABASE_USER,
    password: process.env.COLLABORATION_SERVICE_SQL_DATABASE_PASSWORD,
    database: process.env.COLLABORATION_SERVICE_SQL_DATABASE_NAME,
  };

  return {
    port: parseInt(process.env.COLLABORATION_SERVICE_PORT, 10),
    databaseConfigurationOptions,
    authServiceOptions,
    questionServiceOptions,
    rmqUrl: process.env.RMQ_URL,
  };
};

export default collaborationConfiguration;
