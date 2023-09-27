import { DatabaseConfigurationOptions } from '@app/sql-database';

const collaborationConfiguration = () => {
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
    rmqUrl: process.env.RMQ_URL,
  };
};

export default collaborationConfiguration;
