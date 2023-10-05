import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('refreshTokens', (t) => {
    t.increments('id').primary();
    t.uuid('userId')
      .references('id')
      .inTable('users')
      .notNullable()
      .onDelete('CASCADE');
    t.string('refreshToken').notNullable();
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('refreshTokens');
}
