import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import questionConfiguration from './config/configuration';
import { ConfigModule } from '@app/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './schemas/question.schema';
import { Difficulty, DifficultySchema } from './schemas/difficulty.schema';
import { Category, CategorySchema } from './schemas/category.schema';
import { ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GrpcExceptionFilter } from 'libs/exception-filter/grpc-exception.filter';

@Module({
  imports: [
    ConfigModule.loadConfiguration(questionConfiguration),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow('mongoUri'),
        authSource: 'admin',
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: Question.name,
        schema: QuestionSchema,
      },
      {
        name: Difficulty.name,
        schema: DifficultySchema,
      },
      {
        name: Category.name,
        schema: CategorySchema,
      },
    ]),
  ],
  controllers: [QuestionController],
  providers: [
    QuestionService,
    {
      provide: APP_FILTER,
      useClass: GrpcExceptionFilter,
    },
  ],
})
export class QuestionModule {}
