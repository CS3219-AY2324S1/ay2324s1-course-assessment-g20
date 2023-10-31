import { NestFactory } from '@nestjs/core';
import { getGrpcOptions } from '@app/microservice/utils';
import { Service } from '@app/microservice/services';
import { HistoryModule } from './history.module';
import historyConfiguration from './config/configuration';

async function bootstrap() {
  const { port } = historyConfiguration();

  const app = await NestFactory.createMicroservice(
    HistoryModule,
    getGrpcOptions(Service.HISTORY_SERVICE),
  );

  await app.listen();
  console.log(`History microservice running on port ${port}`);
}
bootstrap();
