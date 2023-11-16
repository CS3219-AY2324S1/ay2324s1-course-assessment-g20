import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('roles', function (table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.timestamps(true, true);
    })
    .then(() =>
      knex.schema.alterTable('userProfiles', (table) => {
        table.integer('roleId').references('id').inTable('roles');
      }),
    );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .table('userProfiles', (table) => table.dropColumn('roleId'))
    .then(() => knex.schema.dropTable('roles'));
}
