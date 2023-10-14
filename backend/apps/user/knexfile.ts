import 'tsconfig-paths/register';
import * as dotenv from 'dotenv';
import { knexSnakeCaseMappers } from 'objection';
import {
  DatabaseConfigurationOptions,
  getDatabaseConfigurationForService,
} from '@app/sql-database';
import { Service } from '@app/microservice/services';

const NODE_ENV = process.env.NODE_ENV;
const IS_DEPLOYMENT = ['staging', 'production'].includes(NODE_ENV);

dotenv.config({ path: `../../.env${NODE_ENV ? `.${NODE_ENV}` : ''}` });
const databaseConfigurationOptions: DatabaseConfigurationOptions =
  getDatabaseConfigurationForService(Service.USER_SERVICE);

const knexConfig = {
  client: 'pg',
  connection: databaseConfigurationOptions,
  migrations: {
    directory: './src/database/migrations',
    loadExtensions: IS_DEPLOYMENT ? ['.js'] : ['.ts'],
  },
  seeds: {
    directory: './src/database/seeds',
    loadExtensions: IS_DEPLOYMENT ? ['.js'] : ['.ts'],
  },
  ...knexSnakeCaseMappers(),
};

export default knexConfig;
