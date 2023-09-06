import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { ConfigModule } from '@nestjs/config';
import questionConfiguration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [questionConfiguration],
      envFilePath: [undefined, 'development'].includes(process.env.NODE_ENV) // during development
        ? '../.env'
        : process.env.NODE_ENV === 'test' // during testing
        ? '../.env.test'
        : undefined,
    }),
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
