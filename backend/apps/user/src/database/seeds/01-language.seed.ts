import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries and reset primary key
  await knex.raw('TRUNCATE TABLE languages RESTART IDENTITY CASCADE');

  // Inserts seed entries
  await knex('languages').insert([
    { id: 1, name: 'JavaScript' },
    { id: 2, name: 'TypeScript' },
  ]);
}
