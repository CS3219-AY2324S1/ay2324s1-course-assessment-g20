import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('history', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('username').notNullable().unique();
    t.timestamps(true, true);
  });

  await knex.schema.createTable('attempts', (t) => {
    t.increments('id').primary();
    t.uuid('historyId').references('id').inTable('history').notNullable();
    t.string('questionId', 24).notNullable();
    t.string('questionAttempt').notNullable();
    t.datetime('dateTimeAttempted').notNullable();
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('history');
  await knex.schema.dropTable('attempts');
}
