import { Service } from '@app/microservice/services';
import { Transport } from '@nestjs/microservices';
import { redisStore } from 'cache-manager-redis-yet';

export default function matchingConfiguration() {
  const websocketGatewayOptions = {
    name: Service.WEBSOCKET_GATEWAY,
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  };

  const getMatchingStoreConfigurationOptions = async () => ({
    store: await redisStore(),
    port: process.env.REDIS_PORT,
  });

  return {
    port: parseInt(process.env.MATCHING_SERVICE_PORT, 10),
    websocketGatewayOptions,
    getMatchingStoreConfigurationOptions,
  };
}
