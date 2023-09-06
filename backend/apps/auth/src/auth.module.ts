import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@app/config';
import authConfiguration from './config/configuration';
import { SqlDatabaseModule } from '@app/sql-database';
import { RefreshTokenModel } from './models/refreshToken.model';
import { RefreshTokensDaoModule } from './daos/refreshTokens/refreshTokens.dao.module';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.loadConfiguration(authConfiguration),
    NestJwtModule,

    // Database and DAOs
    SqlDatabaseModule.factory([RefreshTokenModel]),
    RefreshTokensDaoModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
