import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { RoleModel } from '../../models/role.model';

@Injectable()
export class RoleDaoService {
  constructor(@Inject('RoleModel') private roleModel: ModelClass<RoleModel>) {}

  getAll() {
    return this.roleModel.query().select(['id', 'name']);
  }

  findById(id: number) {
    return this.roleModel.query().findById(id);
  }
}
