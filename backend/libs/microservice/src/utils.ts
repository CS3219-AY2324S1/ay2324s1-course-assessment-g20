import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxyFactory,
  ClientsModule,
  GrpcOptions,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import { Service } from './interservice-api/services';

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

export const registerGrpcClients = (microservices: Service[]) =>
  ClientsModule.registerAsync(
    microservices.map((microservice) => ({
      /**
       * useFactory dynamic module ensures configService is up before we
       * attempt to read the envt variables.
       */
      useFactory: async (configService: ConfigService) =>
        getGrpcOptions(microservice),
      name: `USER_PACKAGE`,
      inject: [ConfigService],
    })),
  );

export const getGrpcOptions = (service: Service): GrpcOptions => {
  const HOST = process.env[`${service}_HOST`];
  const PORT = process.env[`${service}_PORT`];

  return {
    transport: Transport.GRPC,
    options: {
      ...SERVICE_TO_PROTO_OPTIONS_MAP.get(service),
      url: `${HOST}:${PORT}`,
    },
  };
};

const getFullProtoPath = (protoFileName: string) => [
  join(__dirname, `interservice-proto/${protoFileName}.proto`),
];

const SERVICE_TO_PROTO_OPTIONS_MAP = new Map<Service, GrpcOptions['options']>([
  [
    Service.USER_SERVICE,
    { package: 'UserPackage', protoPath: getFullProtoPath('user') },
  ],
]);

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

export const promisify = <T extends object>(service: T) => {
  return new Proxy(service, {
    get: (service, methodName: string) => {
      return async (...params) => {
        return await service[methodName](...params).toPromise();
      };
    },
  });
};
