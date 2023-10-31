/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ID } from './common';
import { Empty } from './google/protobuf/empty';

export interface GetQuestionsResponse {
  questions: Question[];
}

export interface GetDifficultiesResponse {
  difficulties: Difficulty[];
}

export interface GetCategoriesResponse {
  categories: Category[];
}

export interface Question {
  _id?: string | undefined;
  title: string;
  description: string;
  categories: string[];
  difficulty: string;
}

export interface Difficulty {
  _id?: string | undefined;
  name: string;
}

export interface Category {
  _id?: string | undefined;
  name: string;
}

export interface QuestionServiceClient {
  getQuestions(request: Empty): Observable<GetQuestionsResponse>;

  addQuestion(request: Question): Observable<Question>;

  deleteQuestionWithId(request: ID): Observable<ID>;

  getQuestionWithId(request: ID): Observable<Question>;

  updateQuestionWithId(request: Question): Observable<Question>;

  getQuestionsByDifficultyId(request: ID): Observable<GetQuestionsResponse>;

  getDifficulties(request: Empty): Observable<GetDifficultiesResponse>;

  addDifficulty(request: Difficulty): Observable<Difficulty>;

  deleteDifficultyWithId(request: ID): Observable<ID>;

  getCategories(request: Empty): Observable<GetCategoriesResponse>;

  addCategory(request: Category): Observable<Category>;

  deleteCategoryWithId(request: ID): Observable<ID>;
}

export interface QuestionServiceController {
  getQuestions(
    request: Empty,
  ):
    | Promise<GetQuestionsResponse>
    | Observable<GetQuestionsResponse>
    | GetQuestionsResponse;

  addQuestion(
    request: Question,
  ): Promise<Question> | Observable<Question> | Question;

  deleteQuestionWithId(request: ID): Promise<ID> | Observable<ID> | ID;

  getQuestionWithId(
    request: ID,
  ): Promise<Question> | Observable<Question> | Question;

  updateQuestionWithId(
    request: Question,
  ): Promise<Question> | Observable<Question> | Question;

  getQuestionsByDifficultyId(
    request: ID,
  ):
    | Promise<GetQuestionsResponse>
    | Observable<GetQuestionsResponse>
    | GetQuestionsResponse;

  getDifficulties(
    request: Empty,
  ):
    | Promise<GetDifficultiesResponse>
    | Observable<GetDifficultiesResponse>
    | GetDifficultiesResponse;

  addDifficulty(
    request: Difficulty,
  ): Promise<Difficulty> | Observable<Difficulty> | Difficulty;

  deleteDifficultyWithId(request: ID): Promise<ID> | Observable<ID> | ID;

  getCategories(
    request: Empty,
  ):
    | Promise<GetCategoriesResponse>
    | Observable<GetCategoriesResponse>
    | GetCategoriesResponse;

  addCategory(
    request: Category,
  ): Promise<Category> | Observable<Category> | Category;

  deleteCategoryWithId(request: ID): Promise<ID> | Observable<ID> | ID;
}

export function QuestionServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'getQuestions',
      'addQuestion',
      'deleteQuestionWithId',
      'getQuestionWithId',
      'updateQuestionWithId',
      'getQuestionsByDifficultyId',
      'getDifficulties',
      'addDifficulty',
      'deleteDifficultyWithId',
      'getCategories',
      'addCategory',
      'deleteCategoryWithId',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('QuestionService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('QuestionService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const QUESTION_SERVICE_NAME = 'QuestionService';
