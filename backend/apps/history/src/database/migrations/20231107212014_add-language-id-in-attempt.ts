import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('attempts', function (t) {
    t.integer('languageId').nullable().defaultTo(1);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('attempts', (t) => {
    t.dropColumn('languageId');
  });
}
