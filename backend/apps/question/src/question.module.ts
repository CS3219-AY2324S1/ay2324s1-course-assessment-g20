import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import questionConfiguration from './config/configuration';
import { ConfigModule } from '@app/config';

@Module({
  imports: [ConfigModule.loadConfiguration(questionConfiguration)],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
