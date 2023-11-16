import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('sessions', (t) => {
    t.string('questionId', 24).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('sessions', (t) => {
    t.dropColumn('questionId');
  });
}
