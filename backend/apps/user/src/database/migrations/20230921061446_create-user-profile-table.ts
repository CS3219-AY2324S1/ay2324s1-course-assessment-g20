import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('userProfiles', function (table) {
    table.increments('id').primary();
    table
      .uuid('userId')
      .references('id')
      .inTable('users')
      .notNullable()
      .onDelete('CASCADE');
    table.string('name').notNullable();
    table.string('username').unique().nullable();
    table.integer('preferredLanguageId').references('id').inTable('languages');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('userProfiles');
}
