import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('userProfiles', function (table) {
    table.string('username').nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('userProfiles', t => t.string('username').notNullable().alter());
}

