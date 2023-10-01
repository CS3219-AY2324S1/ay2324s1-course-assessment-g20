import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries and reset primary key
  await knex.raw('TRUNCATE TABLE roles RESTART IDENTITY CASCADE');

  // Inserts seed entries
  await knex('roles').insert([
    { id: 1, name: 'maintainer' },
    { id: 2, name: 'regular' },
  ]);
}
