import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import userConfiguration from './config/configuration';
import { getGrpcOptions } from '@app/microservice/utils';
import { Service } from '@app/microservice/services';

async function bootstrap() {
  const { port } = userConfiguration();

  const app = await NestFactory.createMicroservice(
    UserModule,
    getGrpcOptions(Service.USER_SERVICE),
  );

  await app.listen();
  console.log(`User microservice running on port ${port}`);
}
bootstrap();
