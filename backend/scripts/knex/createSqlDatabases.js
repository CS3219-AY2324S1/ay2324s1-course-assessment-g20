const Knex = require('knex');
require('dotenv').config({
  path: `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`,
});

const userServiceDatabaseOptions = {
  host: process.env.USER_SERVICE_SQL_DATABASE_HOST,
  port: process.env.USER_SERVICE_SQL_DATABASE_PORT,
  user: process.env.USER_SERVICE_SQL_DATABASE_USER,
  password: process.env.USER_SERVICE_SQL_DATABASE_PASSWORD,
  database: process.env.USER_SERVICE_SQL_DATABASE_NAME,
};
const collaborationServiceDatabaseOptions = {
  host: process.env.COLLABORATION_SERVICE_SQL_DATABASE_HOST,
  port: process.env.COLLABORATION_SERVICE_SQL_DATABASE_PORT,
  user: process.env.COLLABORATION_SERVICE_SQL_DATABASE_USER,
  password: process.env.COLLABORATION_SERVICE_SQL_DATABASE_PASSWORD,
  database: process.env.COLLABORATION_SERVICE_SQL_DATABASE_NAME,
};

const databaseConnections = [
  userServiceDatabaseOptions,
  collaborationServiceDatabaseOptions,
];

async function createDatabaseIfNotExist(connectionOptions) {
  const databaseName = connectionOptions.database;
  if (!databaseName) {
    throw new Error('Database name(s) not specified!');
  }

  const optionsWithoutDatabaseName = {
    ...connectionOptions,
  };
  delete optionsWithoutDatabaseName.database;

  let knex = Knex({
    client: 'pg',
    connection: optionsWithoutDatabaseName,
  });

  // Create database if it does not yet exist
  const r = await knex.raw(
    `SELECT datname FROM pg_catalog.pg_database WHERE datname = '${databaseName}'`,
  );
  if (!r.rowCount) {
    await knex.raw(`CREATE DATABASE ??`, databaseName);
  }
}

Promise.all(databaseConnections.map((c) => createDatabaseIfNotExist(c)))
  .catch(console.log)
  .finally(() => process.exit(0));
