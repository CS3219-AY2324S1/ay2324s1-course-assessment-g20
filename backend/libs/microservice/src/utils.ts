import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientGrpc,
  ClientProxyFactory,
  ClientsModule,
  GrpcOptions,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import { Service } from './interservice-api/services';

// RMQ
// TODO: RMQ logic left here for matching service implementation
export enum RmqQueue {
  PLACHOLDER = 'placeholder_queue',
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
]);

export const getPromisifiedGrpcService = <T extends object>(
  client: ClientGrpc,
  rpcService: string,
) => promisify(client.getService<T>(rpcService));

const promisify = <T extends object>(service: T) => {
  return new Proxy(service, {
    get: (service, methodName: string) => {
      return async (...params) => {
        return await service[methodName](...params).toPromise();
      };
    },
  });
};
