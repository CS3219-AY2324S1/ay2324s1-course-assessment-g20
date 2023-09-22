import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('userProfiles', function (table) {
    table.increments('id').primary();
    table.uuid('userId').notNullable(); // references 'id' column in the 'users' table in the auth microservice
    table.string('name').notNullable();
    table
      .integer('preferredLanguageId')
      .references('id')
      .inTable('preferredLanguages');
    table.integer('roleId').references('id').inTable('roles');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('userProfiles');
}
