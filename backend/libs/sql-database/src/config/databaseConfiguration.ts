import { Service } from '@app/microservice/services';
import { DatabaseConfigurationOptions } from '@app/sql-database';

export const getDatabaseConfigurationForService = (
  service: Service,
): DatabaseConfigurationOptions => {
  return {
    host: process.env[`${service}_SQL_DATABASE_HOST`],
    port: process.env[`${service}_SQL_DATABASE_PORT`],
    user: process.env[`${service}_SQL_DATABASE_USER`],
    password: process.env[`${service}_SQL_DATABASE_PASSWORD`],
    database: process.env[`${service}_SQL_DATABASE_NAME`],
  };
};
