import { DynamicModule } from '@nestjs/common';
import {
  ConfigService,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';

export class ConfigModule extends NestConfigModule {
  static loadConfiguration(configuration: () => object): DynamicModule {
    return {
      imports: [
        NestConfigModule.forRoot({
          load: [configuration],
          ignoreEnvFile: ['staging', 'production'].includes(
            process.env.NODE_ENV,
          ),
          envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
        }),
      ],
      module: ConfigModule,
      providers: [ConfigService],
      global: true,
    };
  }
}
