import 'tsconfig-paths/register';
import { Knex } from 'knex';
import { MOCK_ADMIN_USER_PROFILE, MOCK_USER_1_PROFILE } from '@app/mocks';

const NODE_ENV = process.env.NODE_ENV;
const IS_DEPLOYMENT = ['staging', 'production'].includes(NODE_ENV);

export async function seed(knex: Knex): Promise<void> {
  if (IS_DEPLOYMENT) {
    console.log('skipping user profile seeds');
    return;
  }

  // Deletes ALL existing entries and reset primary key
  await knex.raw('TRUNCATE TABLE user_profiles RESTART IDENTITY CASCADE');

  // Inserts seed entries
  await knex('user_profiles').insert(
    [MOCK_ADMIN_USER_PROFILE, MOCK_USER_1_PROFILE].map((profile) => ({
      userId: profile.userId,
      name: profile.name,
      username: profile.username,
      preferredLanguageId: profile.preferredLanguageId,
      roleId: profile.roleId,
    })),
  );
}
