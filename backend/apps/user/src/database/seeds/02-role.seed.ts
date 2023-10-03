import { Knex } from 'knex';

export enum Role {
  MAINTAINER = 1,
  REGULAR = 2,
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries and reset primary key
  await knex.raw('TRUNCATE TABLE roles RESTART IDENTITY CASCADE');

  // Inserts seed entries
  await knex('roles').insert(
    Object.entries(Role)
      .filter(
        ([key, value]) => typeof key === 'string' && typeof value === 'number',
      )
      .map(([key, value]) => {
        return { id: value, name: key };
      }),
  );
}
