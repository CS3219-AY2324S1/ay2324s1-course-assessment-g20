import { RedisOptions, Transport } from '@nestjs/microservices';

const wsGatewayConfiguration = () => {
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

  return {
    port: parseInt(process.env.WS_GATEWAY_PORT, 10),
    websocketGatewayOptions,
    mongoUri: process.env.COLLABORATION_SERVICE_MONGODB_URL,
    connectionTimeout: parseInt(
      process.env.MATCHING_SERVICE_CONNECTION_TTL,
      10,
    ),
  };
};

export default wsGatewayConfiguration;
