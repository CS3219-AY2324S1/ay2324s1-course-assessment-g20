import { Knex } from 'knex';

export const MOCK_USER_1_UUID = '4394cce2-7f04-41f2-8ade-8b21cad1cb20';
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries and reset primary key
  await knex.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE');

  // Inserts seed entries
  await knex('users').insert([
    {
      id: MOCK_USER_1_UUID,
      email: 'alison@test.com',
      oauthName: 'Alison Lim',
      authProvider: 'google',
      authProviderId: 'authTestId1',
    },
  ]);
}
