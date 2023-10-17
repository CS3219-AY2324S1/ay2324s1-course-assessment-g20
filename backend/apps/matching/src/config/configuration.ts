import { Service } from '@app/microservice/services';
import { Transport } from '@nestjs/microservices';
import { redisStore } from 'cache-manager-redis-yet';

export default function matchingConfiguration() {
  const websocketGatewayOptions = {
    name: Service.WEBSOCKET_GATEWAY,
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:' + process.env.KAFKA_PORT],
      },
    },
  };

  const matchingStoreConfigurationOptions = {
    store: redisStore({}),
  };

  return {
    port: parseInt(process.env.MATCHING_SERVICE_PORT, 10),
    websocketGatewayOptions,
    matchingStoreConfigurationOptions,
  };
}
