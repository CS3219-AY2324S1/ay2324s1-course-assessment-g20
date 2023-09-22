import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import userConfiguration from './config/configuration';
import { ConfigModule } from '@app/config';
import { SqlDatabaseModule } from '@app/sql-database';

@Module({
  imports: [
    ConfigModule.loadConfiguration(userConfiguration),
    SqlDatabaseModule.factory([]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
