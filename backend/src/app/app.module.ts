import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConstantsModule } from '../utils/constants/constants.module';

@Module({
  imports: [ConstantsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
