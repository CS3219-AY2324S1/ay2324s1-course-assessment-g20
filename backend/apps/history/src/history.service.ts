import {
  COLLABORATION_SERVICE_NAME,
  CollaborationServiceClient,
} from '@app/microservice/interfaces/collaboration';
import {
  QUESTION_SERVICE_NAME,
  QuestionServiceClient,
} from '@app/microservice/interfaces/question';
import { Service } from '@app/microservice/services';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { HistoryDaoService } from './database/daos/history/history.dao.service';

@Injectable()
export class HistoryService implements OnModuleInit {
  private questionService: QuestionServiceClient;
  private collabService: CollaborationServiceClient;

  constructor(
    @Inject(Service.QUESTION_SERVICE)
    private readonly questionServiceClient: ClientGrpc,
    @Inject(Service.COLLABORATION_SERVICE)
    private readonly collabServiceClient: ClientGrpc,
    private readonly historyDaoService: HistoryDaoService,
  ) {}

  onModuleInit() {
    this.questionService =
      this.questionServiceClient.getService<QuestionServiceClient>(
        QUESTION_SERVICE_NAME,
      );
    this.collabService =
      this.collabServiceClient.getService<CollaborationServiceClient>(
        COLLABORATION_SERVICE_NAME,
      );
  }

  createHistoryAttempt() {
    this.historyDaoService.create('test');
  }
}
