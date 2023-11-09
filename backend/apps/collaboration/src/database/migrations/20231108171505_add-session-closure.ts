import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('sessions', function (table) {
    table.boolean('isClosed').notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('sessions', (t) => {
    t.dropColumn('isClosed');
  });
}
