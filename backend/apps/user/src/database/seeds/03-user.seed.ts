import { Knex } from 'knex';

const NODE_ENV = process.env.NODE_ENV;
const IS_DEPLOYMENT = ['staging', 'production'].includes(NODE_ENV);

export const MOCK_USER_1_UUID = '4394cce2-7f04-41f2-8ade-8b21cad1cb20';
export const MOCK_USER_2_UUID = '030eeafc-26cc-4e16-8467-f55b818689fa';
export const MOCK_USER_1_NAME = 'Alice Tan';
export const MOCK_USER_2_NAME = 'Bob Lim';
const MOCK_USER_1_EMAIL = 'alicetan@gmail.com';
const MOCK_USER_2_EMAIL = 'boblim@gmail.com';
const MOCK_USER_1_OAUTH_ID = 'random-oauth-id-1';
const MOCK_USER_2_OAUTH_ID = 'random-oauth-id-2';
const MOCK_AUTH_PROVIDER = 'google';

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
      authProvider: MOCK_AUTH_PROVIDER,
      authProviderId: MOCK_USER_1_OAUTH_ID,
      oauthName: MOCK_USER_1_NAME,
      email: MOCK_USER_1_EMAIL,
    },
    {
      id: MOCK_USER_2_UUID,
      authProvider: MOCK_AUTH_PROVIDER,
      authProviderId: MOCK_USER_2_OAUTH_ID,
      oauthName: MOCK_USER_2_NAME,
      email: MOCK_USER_2_EMAIL,
    },
  ]);
}
