import { getRmqOptionsForQueue } from '@app/microservice/utils';
import { DatabaseConfigurationOptions } from '@app/sql-database';
import { RmqQueue } from '@app/microservice/utils';

const collaborationConfiguration = () => {
  const userServiceOptions = getRmqOptionsForQueue(RmqQueue.USER);
  const questionServiceOptions = getRmqOptionsForQueue(RmqQueue.QUESTION);

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
    userServiceOptions,
    questionServiceOptions,
    rmqUrl: process.env.RMQ_URL,
  };
};

export default collaborationConfiguration;
