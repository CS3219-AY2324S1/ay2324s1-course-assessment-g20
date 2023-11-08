import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('history', function (t) {
    t.dropColumn('username');
    t.uuid('userId').unique().nullable();
  });

  await knex.schema.alterTable('attempts', (t) => {
    t.dropColumn('languageId');
    t.dropColumn('questionAttempt');
    t.uuid('sessionId').nullable();
    t.unique(['historyId', 'sessionId']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('history', (t) => {
    t.string('username').unique().nullable();
    t.dropColumn('userId');
  });

  await knex.schema.alterTable('attempts', (t) => {
    t.dropUnique(['historyId', 'sessionId']);
    t.integer('languageId').nullable().defaultTo(1);
    t.text('questionAttempt').nullable();
    t.dropColumn('sessionId');
  });
}
