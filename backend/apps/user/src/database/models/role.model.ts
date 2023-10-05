import { BaseModel } from '@app/sql-database';

export class RoleModel extends BaseModel {
  static tableName = 'roles';

  readonly name: string;
}
