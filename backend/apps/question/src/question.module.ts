import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { ConfigModule } from '@nestjs/config';
import questionConfiguration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [questionConfiguration],
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
