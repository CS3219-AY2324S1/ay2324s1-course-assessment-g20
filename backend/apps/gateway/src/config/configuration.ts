import { _StrategyOptionsBase } from 'passport-google-oauth20';
import { getRmqOptionsForQueue } from '@app/config/rmqConfiguration';
import { RmqQueue } from '@app/types/rmqQueues';

const gatewayConfiguration = () => {
  const googleOauthOptions: _StrategyOptionsBase = {
    clientID: process.env.OAUTH_GOOGLE_ID,
    clientSecret: process.env.OAUTH_GOOGLE_SECRET,
    callbackURL: process.env.OAUTH_GOOGLE_REDIRECT_URL,
  };

  const questionServiceOptions = getRmqOptionsForQueue(RmqQueue.QUESTION);
  const userServiceOptions = getRmqOptionsForQueue(RmqQueue.USER);

  return {
    port: parseInt(process.env.API_GATEWAY_PORT, 10),
    corsOrigin: process.env.CORS_ORIGIN,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    questionServiceOptions,
    userServiceOptions,
    googleOauthOptions,
  };
};

export default gatewayConfiguration;
