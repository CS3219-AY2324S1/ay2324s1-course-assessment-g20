import { RmqQueue } from '@app/types/rmqQueues';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { _StrategyOptionsBase } from 'passport-google-oauth20';

const gatewayConfiguration = () => {
  const rmqUrl = process.env.RMQ_URL;

  const getRmqOptions = (rmqQueue: RmqQueue): RmqOptions => ({
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: rmqQueue,
    },
  });

  const questionServiceOptions = getRmqOptions(RmqQueue.QUESTION);
  const authServiceOptions = getRmqOptions(RmqQueue.AUTH);
  const matchingServiceOptions = getRmqOptions(RmqQueue.MATCHING);
  const collaborationServiceOptions = getRmqOptions(RmqQueue.COLLABORATION);

  const googleOauthOptions: _StrategyOptionsBase = {
    clientID: process.env.OAUTH_GOOGLE_ID,
    clientSecret: process.env.OAUTH_GOOGLE_SECRET,
    callbackURL: process.env.OAUTH_GOOGLE_REDIRECT_URL,
  };

  return {
    port: parseInt(process.env.API_GATEWAY_PORT, 10),
    host: process.env.QUESTION_SERVICE_SQL_DATABASE_HOST,
    corsOrigin: process.env.CORS_ORIGIN,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    questionServiceOptions,
    authServiceOptions,
    collaborationServiceOptions,
    googleOauthOptions,
    matchingServiceOptions,
    rmqUrl: rmqUrl,
  };
};

export default gatewayConfiguration;
