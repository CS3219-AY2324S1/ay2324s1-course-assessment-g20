import { Service } from '@app/microservice/services';
import {
  DatabaseConfigurationOptions,
  getDatabaseConfigurationForService,
} from '@app/sql-database';
import { Transport } from '@nestjs/microservices';
import { redisStore } from 'cache-manager-redis-yet';

export default function matchingConfiguration() {
  const databaseConfigurationOptions: DatabaseConfigurationOptions =
    getDatabaseConfigurationForService(Service.MATCHING_SERVICE);

  const kafkaConfigurationOptions = {
    name: Service.WEBSOCKET_SERVICE,
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:' + process.env.KAFKA_PORT],
      },
    },
  };

  const redisConfigurationOptions = {
    store: redisStore({
      ttl: parseInt(process.env.MATCHING_SERVICE_CACHE_TTL, 10),
    }),
  };

  return {
    port: parseInt(process.env.MATCHING_SERVICE_PORT, 10),
    databaseConfigurationOptions,
    kafkaConfigurationOptions,
    redisConfigurationOptions,
  };
}
