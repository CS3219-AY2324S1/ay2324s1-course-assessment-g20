import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { WsGatewayModule } from './../src/ws-gateway.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { ClientGrpc } from '@nestjs/microservices';
import { Service } from '@app/microservice/services';
import {
  USER_AUTH_SERVICE_NAME,
  UserAuthServiceClient,
} from '@app/microservice/interfaces/user';
import { MOCK_ADMIN_USER, MOCK_QUESTION_3, MOCK_USER_1 } from '@app/mocks';
import { firstValueFrom } from 'rxjs';
import * as WebSocket from 'ws';
import {
  QUESTION_SERVICE_NAME,
  QuestionServiceClient,
} from '@app/microservice/interfaces/question';

describe('WsGatewayController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WsGatewayModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useWebSocketAdapter(new WsAdapter(app));
    await app.init();
  });

  describe('/matching', () => {
    let ws1: WebSocket;
    let ws2: WebSocket;
    let wsTicket1: string;
    let wsTicket2: string;
    let mockDifficultyId: string;
    const websocketUrl = `ws://localhost:${process.env.WS_GATEWAY_PORT}/ws/matching`;

    beforeAll(async () => {
      const questionServiceClient: ClientGrpc = app.get(
        Service.QUESTION_SERVICE,
      );
      const questionService =
        questionServiceClient.getService<QuestionServiceClient>(
          QUESTION_SERVICE_NAME,
        );

      await Promise.all(
        MOCK_QUESTION_3.categories.map((category) =>
          firstValueFrom(questionService.addCategory({ name: category })),
        ),
      );

      mockDifficultyId = (
        await firstValueFrom(
          questionService.addDifficulty({ name: MOCK_QUESTION_3.difficulty }),
        )
      )._id;

      await firstValueFrom(questionService.addQuestion(MOCK_QUESTION_3));

      const userServiceClient: ClientGrpc = app.get(Service.USER_SERVICE);
      const userAuthService =
        userServiceClient.getService<UserAuthServiceClient>(
          USER_AUTH_SERVICE_NAME,
        );
      const ticket1 = await firstValueFrom(
        userAuthService.generateWebsocketTicket({ userId: MOCK_USER_1.id }),
      );
      const ticket2 = await firstValueFrom(
        userAuthService.generateWebsocketTicket({ userId: MOCK_ADMIN_USER.id }),
      );
      wsTicket1 = ticket1.id;
      wsTicket2 = ticket2.id;
    });

    it(`should be unauthorized when trying to access matching websocket without a ticket`, async () => {
      const unauthorizedWs = new WebSocket(websocketUrl);
      await new Promise((resolve) => unauthorizedWs.on('open', resolve));
      await new Promise<void>((resolve) =>
        unauthorizedWs.on('message', (data: string) => {
          expect(data === 'unauthorized');
          unauthorizedWs.close();
          resolve();
        }),
      );
    });

    it(`should be unauthorized when trying to access matching websocket with an invalid ticket`, async () => {
      const unauthorizedWs = new WebSocket(
        `${websocketUrl}?ticket=invalidTicket`,
      );
      await new Promise((resolve) => unauthorizedWs.on('open', resolve));
      await new Promise<void>((resolve) =>
        unauthorizedWs.on('message', (data: string) => {
          expect(data === 'unauthorized');
          unauthorizedWs.close();
          resolve();
        }),
      );
    });

    it(`should return a new session ID when 2 users with valid tickets are matching on same difficulty`, async () => {
      ws1 = new WebSocket(`${websocketUrl}?ticket=${wsTicket1}`);
      ws2 = new WebSocket(`${websocketUrl}?ticket=${wsTicket2}`);
      await new Promise((resolve) => ws1.on('open', resolve));
      await new Promise((resolve) => ws2.on('open', resolve));

      ws1.send(
        JSON.stringify({
          event: 'get_match',
          data: {
            questionDifficulty: mockDifficultyId,
          },
        }),
      );

      ws2.send(
        JSON.stringify({
          event: 'get_match',
          data: {
            questionDifficulty: mockDifficultyId,
          },
        }),
      );

      const onSuccessfulMatch = (websocket: WebSocket) => (resolve) => {
        websocket.on('message', (data: string) => {
          const message = JSON.parse(data);
          expect(message).toHaveProperty('event');
          expect(message.event === 'match');
          expect(message).toHaveProperty('data');
          expect(message.data).toEqual(
            expect.objectContaining({
              sessionId: expect.any(String),
            }),
          );

          websocket.close();
          resolve(message.data.sessionId);
        });
      };

      const sessionId1 = await new Promise<string>(onSuccessfulMatch(ws1));
      const sessionId2 = await new Promise<string>(onSuccessfulMatch(ws2));
      expect(sessionId1).toEqual(sessionId2);
    }, 10000);
  });
});
