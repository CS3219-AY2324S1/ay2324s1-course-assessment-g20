import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@app/config';
import authConfiguration from './config/configuration';
import { SqlDatabaseModule } from '@app/sql-database';
import { RefreshTokensDaoModule } from './database/daos/refreshTokens/refreshTokens.dao.module';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { UserDaoModule } from './database/daos/users/user.dao.module';
import { UserModel } from './database/models/user.model';
import { RefreshTokenModel } from './database/models/refreshToken.model';

@Module({
  imports: [
    ConfigModule.loadConfiguration(authConfiguration),
    NestJwtModule,

    // Database and DAOs
    SqlDatabaseModule.factory([RefreshTokenModel, UserModel]),
    RefreshTokensDaoModule,
    UserDaoModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
