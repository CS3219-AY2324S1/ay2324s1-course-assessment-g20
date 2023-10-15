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
import { Service } from './services';

export enum RmqQueue {
  MATCHING_WEBSOCKET = 'matching_websocket_queue',
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

// gRPC
export const registerGrpcClients = (microservices: Service[]) =>
  ClientsModule.registerAsync(
    microservices.map((microservice) => ({
      /**
       * useFactory dynamic module ensures configService is up before we
       * attempt to read the envt variables.
       */
      useFactory: async (configService: ConfigService) =>
        getGrpcOptions(microservice),
      name: microservice,
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
  [
    Service.QUESTION_SERVICE,
    { package: 'QuestionPackage', protoPath: getFullProtoPath('question') },
  ],
  [
    Service.COLLABORATION_SERVICE,
    {
      package: 'CollaborationPackage',
      protoPath: getFullProtoPath('collaboration'),
    },
  ],
  [
    Service.MATCHING_SERVICE,
    { package: 'MatchingPackage', protoPath: getFullProtoPath('matching') },
  ],
]);
