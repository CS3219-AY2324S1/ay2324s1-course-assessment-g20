import { DatabaseConfigurationOptions } from '@app/sql-database';

const questionConfiguration = () => {
  const databaseConfigurationOptions: DatabaseConfigurationOptions = {
    host: process.env.QUESTION_SERVICE_SQL_DATABASE_HOST,
    port: process.env.QUESTION_SERVICE_SQL_DATABASE_PORT,
    user: process.env.QUESTION_SERVICE_SQL_DATABASE_USER,
    password: process.env.QUESTION_SERVICE_SQL_DATABASE_PASSWORD,
    database: process.env.QUESTION_SERVICE_SQL_DATABASE_NAME,
  };

  return {
    port: parseInt(process.env.QUESTION_SERVICE_PORT, 10),
    databaseConfigurationOptions,
    rmqUrl: process.env.RMQ_URL,
  };
};

export default questionConfiguration;
