import { Knex } from 'knex';

export enum Language {
  JAVASCRIPT = 1,
  TYPESCRIPT = 2,
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries and reset primary key
  await knex.raw('TRUNCATE TABLE languages RESTART IDENTITY CASCADE');

  // Inserts seed entries
  await knex('languages').insert(
    Object.entries(Language)
      .filter(
        ([key, value]) => typeof key === 'string' && typeof value === 'number',
      )
      .map(([key, value]) => {
        return { id: value, name: key };
      }),
  );
}
