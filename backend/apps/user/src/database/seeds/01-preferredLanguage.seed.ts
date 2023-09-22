import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('preferredLanguages').del();

  // Inserts seed entries
  await knex('preferredLanguages').insert([
    { id: 1, name: 'JavaScript' },
    { id: 2, name: 'TypeScript' },
  ]);
}
