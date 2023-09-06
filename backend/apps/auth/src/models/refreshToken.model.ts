import { BaseModel } from '@app/sql-database';

export class RefreshTokenModel extends BaseModel {
  static tableName = 'refreshTokens';

  readonly userId: string;
  readonly refreshToken: string;
}
