import { _StrategyOptionsBase } from 'passport-google-oauth20';
import { getRmqOptions } from '@app/config/rmqConfiguration';

const gatewayConfiguration = () => {
  const googleOauthOptions: _StrategyOptionsBase = {
    clientID: process.env.OAUTH_GOOGLE_ID,
    clientSecret: process.env.OAUTH_GOOGLE_SECRET,
    callbackURL: process.env.OAUTH_GOOGLE_REDIRECT_URL,
  };

  const { questionServiceOptions, authServiceOptions, userServiceOptions } = getRmqOptions();

  return {
    port: parseInt(process.env.API_GATEWAY_PORT, 10),
    corsOrigin: process.env.CORS_ORIGIN,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    questionServiceOptions,
    authServiceOptions,
    userServiceOptions,
    googleOauthOptions,
  };
};

export default gatewayConfiguration;
