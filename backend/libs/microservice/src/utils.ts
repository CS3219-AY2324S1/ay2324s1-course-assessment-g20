import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxyFactory,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';

export enum RmqQueue {
  QUESTION = 'question_queue',
  USER = 'user_queue',
  COLLABORATION = 'collaboration_queue',
}

export const getRmqOptionsForQueue = (rmqQueue: RmqQueue): RmqOptions => {
  const rmqUrl = process.env.RMQ_URL;
  if (!rmqUrl) {
    throw new Error('RMQ URL not configured!');
  }
  return {
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: rmqQueue,
    },
  };
};

export const createMicroserviceClientProxyProvider = (
  microservice: string,
  optionsKey: string,
): Provider => ({
  provide: microservice,
  useFactory: (configService: ConfigService) => {
    const microserviceOptions = configService.get(optionsKey);
    return ClientProxyFactory.create(microserviceOptions);
  },
  inject: [ConfigService],
});
