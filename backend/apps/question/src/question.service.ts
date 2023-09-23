import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionService {
  getHello(): string {
    console.log('responding to hello request');
    return 'Hello World from question!';
  }
}
