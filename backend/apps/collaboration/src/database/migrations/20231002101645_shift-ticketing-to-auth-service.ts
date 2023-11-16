import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('sessionTickets', (t) => {
    t.increments('id').primary();
    t.uuid('sessionId').references('id').inTable('sessions').notNullable();
    t.uuid('ticketId').notNullable(); // fkey to auth database
    t.timestamps(true, true);
  });

  await knex.schema.dropTable('collabSessionWsTickets');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.createTable('collabSessionWsTickets', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('userId').notNullable();
    t.uuid('sessionId').references('id').inTable('sessions').notNullable();
    t.datetime('expiry').notNullable();
    t.timestamps(true, true);
  });

  await knex.schema.dropTable('sessionTickets');
}
