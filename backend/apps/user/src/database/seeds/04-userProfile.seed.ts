import { Knex } from 'knex';
import {
  MOCK_USER_1_UUID,
  MOCK_USER_2_UUID,
  MOCK_USER_1_NAME,
  MOCK_USER_2_NAME,
} from './03-user.seed';

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
  await knex('user_profiles').insert([
    {
      userId: MOCK_USER_1_UUID,
      name: MOCK_USER_1_NAME,
      preferredLanguageId: 1,
      roleId: 1,
    },
    {
      userId: MOCK_USER_2_UUID,
      name: MOCK_USER_2_NAME,
      preferredLanguageId: 2,
      roleId: 2,
    },
  ]);
}
