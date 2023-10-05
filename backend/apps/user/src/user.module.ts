import { Module } from '@nestjs/common';
import userConfiguration from './config/configuration';
import { ConfigModule } from '@app/config';
import { ProfileModule } from './profile/profile.module';
import { AuthModule } from './auth/auth.module';
import { LanguageModule } from './language/language.module';

@Module({
  imports: [
    ConfigModule.loadConfiguration(userConfiguration),
    ProfileModule,
    AuthModule,
    LanguageModule,
  ],
})
export class UserModule {}
