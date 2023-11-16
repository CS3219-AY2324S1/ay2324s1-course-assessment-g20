import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('sessions', function (table) {
    table.integer('languageId').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('sessions', (t) => {
    t.dropColumn('languageId');
  });
}
