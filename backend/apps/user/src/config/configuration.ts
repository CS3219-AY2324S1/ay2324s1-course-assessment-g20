import { DatabaseConfigurationOptions } from '@app/sql-database';

const userConfiguration = () => {
  const databaseConfigurationOptions: DatabaseConfigurationOptions = {
    host: process.env.USER_SERVICE_SQL_DATABASE_HOST,
    port: process.env.USER_SERVICE_SQL_DATABASE_PORT,
    user: process.env.USER_SERVICE_SQL_DATABASE_USER,
    password: process.env.USER_SERVICE_SQL_DATABASE_PASSWORD,
    database: process.env.USER_SERVICE_SQL_DATABASE_NAME,
  };

  return {
    port: parseInt(process.env.USER_SERVICE_PORT, 10),
    databaseConfigurationOptions,
    rmqUrl: process.env.RMQ_URL,
  };
};

export default userConfiguration;
