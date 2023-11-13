import 'tsconfig-paths/register';
import { Knex } from 'knex';
import { MOCK_ADMIN_USER, MOCK_USER_1, MOCK_USER_2 } from '@app/mocks';

const NODE_ENV = process.env.NODE_ENV;
const IS_DEPLOYMENT = ['staging', 'production'].includes(NODE_ENV);

export async function seed(knex: Knex): Promise<void> {
  if (IS_DEPLOYMENT) {
    console.log('skipping user seeds');
    return;
  }

  // Deletes ALL existing entries and reset primary key
  await knex.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE');

  // Inserts seed entries
  await knex('users').insert(
    [MOCK_ADMIN_USER, MOCK_USER_1, MOCK_USER_2].map((user) => ({
      id: user.id,
      auth_provider: user.authProvider,
      auth_provider_id: user.authProviderId,
      oauth_name: user.oauthName,
      email: user.email,
    })),
  );
}
