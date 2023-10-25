import { Transport } from '@nestjs/microservices';
import { _StrategyOptionsBase } from 'passport-google-oauth20';

const gatewayConfiguration = () => {
  const googleOauthOptions: _StrategyOptionsBase = {
    clientID: process.env.OAUTH_GOOGLE_ID,
    clientSecret: process.env.OAUTH_GOOGLE_SECRET,
    callbackURL: process.env.OAUTH_GOOGLE_REDIRECT_URL,
  };

  const websocketGatewayOptions = {
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  };

  return {
    port: parseInt(process.env.API_GATEWAY_PORT, 10),
    corsOrigin: process.env.CORS_ORIGIN,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    googleOauthOptions,
    websocketGatewayOptions,
    mongoUri: process.env.COLLABORATION_SERVICE_MONGODB_URL,
    connectionTimeout: parseInt(
      process.env.MATCHING_SERVICE_CONNECTION_TTL,
      10,
    ),
  };
};

export default gatewayConfiguration;
