import { DynamicModule } from '@nestjs/common';
import { BaseModel, BaseModelUUID } from './models/base.model';
import { ConfigService } from '@nestjs/config';
import Knex from 'knex';
import { Model, knexSnakeCaseMappers } from 'objection';

export class SqlDatabaseModule {
  static factory(
    models: (typeof BaseModel | typeof BaseModelUUID)[],
  ): DynamicModule {
    const modelProviders = models.map((model) => ({
      provide: model.name,
      useValue: model,
    }));

    return {
      module: SqlDatabaseModule,
      providers: [
        ...modelProviders,
        {
          provide: 'KnexConnection',
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            const databaseOptions = configService.get(
              'databaseConfigurationOptions',
            );
            if (databaseOptions === undefined) {
              throw Error(
                'Database configuration not specified in ConfigModule!',
              );
            }

            const knex = Knex({
              client: 'pg',
              connection: databaseOptions,
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
