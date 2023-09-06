import { DynamicModule } from '@nestjs/common';
import { BaseModel } from './models/base.model';
import { ConfigService } from '@nestjs/config';
import Knex from 'knex';
import { ConfigModule } from '@app/config';
import databaseConfiguration, {
  DatabaseConfiguration,
} from './config/configuration';
import { Model, knexSnakeCaseMappers } from 'objection';

export class SqlDatabaseModule {
  static factory(
    models: (typeof BaseModel)[],
    customDatabaseConfig: DatabaseConfiguration = databaseConfiguration,
  ): DynamicModule {
    const modelProviders = models.map((model) => ({
      provide: model.name,
      useValue: model,
    }));

    return {
      imports: [ConfigModule.loadConfiguration(customDatabaseConfig)],
      module: SqlDatabaseModule,
      providers: [
        ...modelProviders,
        {
          provide: 'KnexConnection',
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            const knex = Knex({
              client: 'pg',
              connection: configService.get('databaseOptions'),
              ...knexSnakeCaseMappers(),
            });

            Model.knex(knex);
            return knex;
          },
        },
      ],
      exports: [...modelProviders],
      global: true,
    };
  }
}
