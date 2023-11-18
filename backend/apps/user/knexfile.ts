import 'tsconfig-paths/register';
import * as dotenv from 'dotenv';
import { knexSnakeCaseMappers } from 'objection';
import {
  DatabaseConfigurationOptions,
  getDatabaseConfigurationForService,
} from '@app/sql-database';
import { Service } from '@app/microservice/services';

const NODE_ENV = process.env.NODE_ENV;

dotenv.config({ path: `../../.env${NODE_ENV ? `.${NODE_ENV}` : ''}` });
const databaseConfigurationOptions: DatabaseConfigurationOptions =
  getDatabaseConfigurationForService(Service.USER_SERVICE);

const knexConfig = {
  client: 'pg',
  connection: databaseConfigurationOptions,
  migrations: {
    directory: './src/database/migrations',
    loadExtensions: ['.ts'],
  },
  seeds: {
    directory: './src/database/seeds',
    loadExtensions: ['.ts'],
  },
  ...knexSnakeCaseMappers(),
};

export default knexConfig;
