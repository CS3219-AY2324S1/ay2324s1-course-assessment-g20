import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('userProfiles', function (table) {
    table.string('username').unique();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('userProfiles', (t) => t.dropColumn('username'));
}
