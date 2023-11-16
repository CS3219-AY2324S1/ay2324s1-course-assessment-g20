import 'tsconfig-paths/register';
import { Knex } from 'knex';
import { Role } from '@app/types/roles';

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
