import { RedisOptions, Transport } from '@nestjs/microservices';
import { redisStore } from 'cache-manager-redis-yet';

export default function matchingConfiguration() {
  const websocketGatewayOptions: RedisOptions = {
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
      password: process.env.REDIS_PASSWORD,
      retryAttempts: 5,
      retryDelay: 2000,
    },
  };

  const getMatchingStoreConfigurationOptions = async () => ({
    store: await redisStore({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      password: process.env.REDIS_PASSWORD,
    }),
    port: process.env.REDIS_PORT,
  });

  return {
    port: parseInt(process.env.MATCHING_SERVICE_PORT, 10),
    websocketGatewayOptions,
    getMatchingStoreConfigurationOptions,
  };
}
