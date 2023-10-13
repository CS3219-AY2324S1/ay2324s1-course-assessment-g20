import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import userConfiguration from './config/configuration';
import {
  RmqQueue,
  getGrpcOptions,
  getRmqOptionsForQueue,
} from '@app/microservice/utils';
import { Service } from '@app/microservice/interservice-api/services';

async function bootstrap() {
  const { port } = userConfiguration();

  const app = await NestFactory.create(UserModule);

  app.connectMicroservice(getRmqOptionsForQueue(RmqQueue.USER));
  app.connectMicroservice(getGrpcOptions(Service.USER_SERVICE));
  await app.startAllMicroservices();

  await app.listen(port);

  console.log(`User microservice running on port ${port}`);
}
bootstrap();
