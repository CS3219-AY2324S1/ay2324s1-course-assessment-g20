import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('preferredLanguages', function (table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.timestamps(true, true);
    })
    .then(() =>
      knex.schema.createTable('roles', function (table) {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.timestamps(true, true);
      }),
    );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('preferredLanguages')
    .then(() => knex.schema.dropTable('roles'));
}
