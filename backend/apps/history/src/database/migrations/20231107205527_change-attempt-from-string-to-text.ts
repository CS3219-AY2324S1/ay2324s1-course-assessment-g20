import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('attempts', (t) => {
    t.text('questionAttempt').notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('attempts', (t) => {
    t.string('questionAttempt').notNullable().alter();
  });
}
