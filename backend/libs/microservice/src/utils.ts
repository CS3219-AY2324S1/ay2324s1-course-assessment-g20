import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxyFactory,
  ClientsModule,
  GrpcOptions,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import { Service } from './services';

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
      useFactory: async () => getGrpcOptions(microservice, true),
      name: microservice,
      inject: [ConfigService],
    })),
  );

export const getGrpcOptions = (
  service: Service,
  fromClient = false,
): GrpcOptions => {
  const HOST = fromClient ? process.env[`${service}_HOST`] : '0.0.0.0';
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
    Service.QUESTION_SERVICE,
    { package: 'QuestionPackage', protoPath: getFullProtoPath('question') },
  ],
]);
