import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('lookingToMatch', function (table) {
    table.uuid('userId').primary();
    table.string('questionDifficulty').notNullable();
    table.boolean('isConnected').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('lookingToMatch');
}
