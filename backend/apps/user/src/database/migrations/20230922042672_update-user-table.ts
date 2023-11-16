import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('users', function (table) {
    table.string('authProvider').notNullable().defaultTo('google');
    table.string('authProviderId').notNullable().defaultTo('');
    table.string('oauthName').notNullable().defaultTo('');
    table.string('email').notNullable().defaultTo('');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('users', (table) => {
    table.dropColumn('authProvider');
    table.dropColumn('authProviderId');
    table.dropColumn('oauthName');
    table.dropColumn('email');
  });
}
