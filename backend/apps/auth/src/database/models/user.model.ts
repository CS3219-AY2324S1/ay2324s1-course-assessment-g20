import { BaseModel } from '@app/sql-database';
import { AuthProvider } from '@app/types/authProvider';

export class UserModel extends BaseModel {
  static tableName = 'users';

  readonly authProvider: AuthProvider;
  readonly authProviderId: string;
  readonly oauthName: string;
  readonly email: string;
}
