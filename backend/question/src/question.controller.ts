import { Controller } from '@nestjs/common';
import { QuestionService } from './question.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @MessagePattern('get_hello')
  getHello(): string {
    return this.questionService.getHello();
  }
}
