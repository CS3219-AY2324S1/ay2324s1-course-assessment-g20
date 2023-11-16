import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SqlDatabaseModule } from '@app/sql-database';
import { UserDaoModule } from '../database/daos/users/user.dao.module';
import { UserModel } from '../database/models/user.model';

@Module({
  imports: [
    // Database and DAOs
    SqlDatabaseModule.factory([UserModel]),
    UserDaoModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
