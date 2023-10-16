import { Model } from 'objection';

class BaseModelTemplate<ID_TYPE> extends Model {
  readonly id: ID_TYPE;

  createdAt: Date;
  updatedAt: Date;

  $beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }
}

export class BaseModel extends BaseModelTemplate<number> {}
export class BaseModelUUID extends BaseModelTemplate<string> {}
