import { Module } from '@nestjs/common';
import userConfiguration from './config/configuration';
import { ConfigModule } from '@app/config';
import { ProfileModule } from './profile/profile.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.loadConfiguration(userConfiguration),
    ProfileModule,
    AuthModule,
  ],
})
export class UserModule {}
