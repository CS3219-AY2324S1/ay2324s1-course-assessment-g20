import { Knex } from 'knex';

const NODE_ENV = process.env.NODE_ENV;
const IS_DEPLOYMENT = ['staging', 'production'].includes(NODE_ENV);

const MOCK_USER_1_UUID = '4394cce2-7f04-41f2-8ade-8b21cad1cb20';
const MOCK_USER_2_UUID = '030eeafc-26cc-4e16-8467-f55b818689fa';

export async function seed(knex: Knex): Promise<void> {
  if (IS_DEPLOYMENT) {
    console.log('skipping user seeds');
    return;
  }

  // Deletes ALL existing entries and reset primary key
  await knex.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE');

  // Inserts seed entries
  await knex('users').insert([
    {
      id: MOCK_USER_1_UUID,
      authProvider: 'google',
      authProviderId: 'random-oauth-id-1',
      oauthName: 'Alice Tan',
      email: 'alicetan@gmail.com',
    },
    {
      id: MOCK_USER_2_UUID,
      authProvider: 'google',
      authProviderId: 'random-oauth-id-2',
      oauthName: 'Bob Lim',
      email: 'boblim@gmail.com',
    },
  ]);
}
