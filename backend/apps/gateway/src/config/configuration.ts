import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { _StrategyOptionsBase } from 'passport-google-oauth20';

const gatewayConfiguration = () => {
  const googleOauthOptions: _StrategyOptionsBase = {
    clientID: process.env.OAUTH_GOOGLE_ID,
    clientSecret: process.env.OAUTH_GOOGLE_SECRET,
    callbackURL: process.env.OAUTH_GOOGLE_REDIRECT_URL,
  };

  const kafkaConfigurationOptions: MicroserviceOptions = {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:' + process.env.KAFKA_PORT],
      },
      consumer: {
        // Each gateway instance should have its own consumer group id to allow each instance to consume the same kafka topic
        groupId: process.env.API_GATEWAY_PORT,
      },
    },
  };

  return {
    port: parseInt(process.env.API_GATEWAY_PORT, 10),
    corsOrigin: process.env.CORS_ORIGIN,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    googleOauthOptions,
    kafkaConfigurationOptions,
    mongoUri: process.env.COLLABORATION_SERVICE_MONGODB_URL,
  };
};

export default gatewayConfiguration;
