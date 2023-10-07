import { _StrategyOptionsBase } from 'passport-google-oauth20';
import { getRmqOptionsForQueue } from '@app/microservice/utils';
import { RmqQueue } from '@app/microservice/utils';

const gatewayConfiguration = () => {
  const googleOauthOptions: _StrategyOptionsBase = {
    clientID: process.env.OAUTH_GOOGLE_ID,
    clientSecret: process.env.OAUTH_GOOGLE_SECRET,
    callbackURL: process.env.OAUTH_GOOGLE_REDIRECT_URL,
  };

  const questionServiceOptions = getRmqOptionsForQueue(RmqQueue.QUESTION);
  const userServiceOptions = getRmqOptionsForQueue(RmqQueue.USER);
  const collaborationServiceOptions = getRmqOptionsForQueue(
    RmqQueue.COLLABORATION,
  );
  const matchingServiceOptions = getRmqOptionsForQueue(RmqQueue.MATCHING);

  return {
    port: parseInt(process.env.API_GATEWAY_PORT, 10),
    host: process.env.QUESTION_SERVICE_SQL_DATABASE_HOST,
    corsOrigin: process.env.CORS_ORIGIN,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    questionServiceOptions,
    userServiceOptions,
    collaborationServiceOptions,
    googleOauthOptions,
    matchingServiceOptions,
  };
};

export default gatewayConfiguration;
