import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import * as dotenv from 'dotenv';
import * as WebSocket from 'ws';
import {
  MOCK_ADMIN_USER,
  MOCK_USER_1,
  MOCK_CATEGORY_1,
  MOCK_DIFFICULTY_1,
  MOCK_QUESTION_1,
  MOCK_DIFFICULTY_2,
  MOCK_CATEGORY_2,
  MOCK_QUESTION_2,
  MOCK_ADMIN_USER_PROFILE,
  MOCK_USER_1_PROFILE,
  MOCK_USER_1_UUID,
} from '@app/mocks';
import { Service } from '@app/microservice/services';
import { ClientGrpc } from '@nestjs/microservices';
import {
  USER_AUTH_SERVICE_NAME,
  UserAuthServiceClient,
} from '@app/microservice/interfaces/user';
import { firstValueFrom, timeout } from 'rxjs';
import { Language } from '@app/types/languages';
import { setTimeout } from 'timers/promises';

const NODE_ENV = process.env.NODE_ENV;
dotenv.config({ path: `../../../.env${NODE_ENV ? `.${NODE_ENV}` : ''}` });

describe('Gateway (e2e)', () => {
  let app: INestApplication;
  // Setup testing module
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useWebSocketAdapter(new WsAdapter(app));
    await app.init();
  });

  // Generate access tokens for mock users
  let MOCK_ADMIN_TOKEN: string;
  let MOCK_USER_1_TOKEN: string;
  let MOCK_USER_1_REFRESH_TOKEN: string;
  beforeEach(async () => {
    const userServiceClient: ClientGrpc = app.get(Service.USER_SERVICE);
    const userAuthService = userServiceClient.getService<UserAuthServiceClient>(
      USER_AUTH_SERVICE_NAME,
    );
    const { accessToken: adminAccessToken, refreshToken: adminRefreshToken } =
      await firstValueFrom(userAuthService.generateJwts(MOCK_ADMIN_USER));
    const { accessToken: user1Token, refreshToken: user1RefreshToken } =
      await firstValueFrom(userAuthService.generateJwts(MOCK_USER_1));
    MOCK_ADMIN_TOKEN = adminAccessToken;
    MOCK_USER_1_TOKEN = user1Token;
    MOCK_USER_1_REFRESH_TOKEN = user1RefreshToken;
  });

  describe('/auth endpoints', () => {
    const prefix = '/auth';

    describe('/google', () => {
      const endpoint = `${prefix}/google`;

      it(`(GET) should return 302`, () => {
        return request(app.getHttpServer()).get(endpoint).expect(302);
      });
    });

    describe('/refresh', () => {
      const endpoint = `${prefix}/refresh`;

      it(`(POST) should return 201 created with new access and refresh tokens when there is a valid refresh token`, async () => {
        const data = {
          refreshToken: MOCK_USER_1_REFRESH_TOKEN,
        };

        const { body } = await request(app.getHttpServer())
          .post(endpoint)
          .send(data)
          .expect(201);
        expect(body).toEqual(
          expect.objectContaining({
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
          }),
        );
      });
    });

    describe('/ticket', () => {
      const endpoint = `${prefix}/ticket`;

      it(`(GET) should return 200 OK with authenticated user`, async () => {
        const { body } = await request(app.getHttpServer())
          .get(endpoint)
          .set('Authorization', `Bearer ${MOCK_USER_1_TOKEN}`)
          .expect(200);
        expect(body).toEqual(
          expect.objectContaining({
            id: expect.any(String),
          }),
        );
      });

      it(`(GET) should return 401 unauthorized with unauthenticated user`, () => {
        request(app.getHttpServer()).get(endpoint).expect(401);
      });
    });
  });

  describe('/question endpoints', () => {
    const prefix = '/question';

    describe('/categories', () => {
      const endpoint = `${prefix}/categories`;
      let mockCategoryId: string;
      it(`(GET) should return 200 OK with authenticated user`, async () => {
        const { body } = await request(app.getHttpServer())
          .get(endpoint)
          .set('Authorization', `Bearer ${MOCK_USER_1_TOKEN}`)
          .expect(200);

        expect(body).toHaveLength(39);
      });

      it(`(GET) should return 401 unauthorized with unauthenticated user`, () => {
        request(app.getHttpServer()).get(endpoint).expect(401);
      });

      it(`(POST) should return 201 created when user has maintainer role`, async () => {
        const data = {
          category: {
            name: MOCK_CATEGORY_1,
          },
        };

        const { body } = await request(app.getHttpServer())
          .post(endpoint)
          .send(data)
          .set('Authorization', `Bearer ${MOCK_ADMIN_TOKEN}`)
          .expect(201);

        mockCategoryId = body._id;

        expect(body).toEqual(
          expect.objectContaining({
            _id: mockCategoryId,
            name: MOCK_CATEGORY_1,
          }),
        );
      });

      it(`(POST) should return 401 unauthorized when user has non-maintainer role`, () => {
        const data = {
          category: {
            name: MOCK_CATEGORY_2,
          },
        };

        request(app.getHttpServer())
          .post(endpoint)
          .send(data)
          .set('Authorization', `Bearer ${MOCK_USER_1_TOKEN}`)
          .expect(401);
      });

      it(`(DELETE) should return 401 unauthorized when user has non-maintainer role`, () => {
        request(app.getHttpServer())
          .delete(`${endpoint}/${mockCategoryId}`)
          .set('Authorization', `Bearer ${MOCK_USER_1_TOKEN}`)
          .expect(401);
      });

      it(`(DELETE) should return 200 OK when user has maintainer role`, async () => {
        const { text } = await request(app.getHttpServer())
          .delete(`${endpoint}/${mockCategoryId}`)
          .set('Authorization', `Bearer ${MOCK_ADMIN_TOKEN}`)
          .expect(200);
        expect(text).toEqual(mockCategoryId);
      });
    });

    describe('/difficulties', () => {
      const endpoint = `${prefix}/difficulties`;
      let mockDifficultyId: string;

      it('(GET) should return 200 OK with authenticated user', async () => {
        const { body } = await request(app.getHttpServer())
          .get(endpoint)
          .set('Authorization', `Bearer ${MOCK_USER_1_TOKEN}`)
          .expect(200);

        expect(body).toHaveLength(3);
      });

      it(`(GET) should return 401 unauthorized with unauthenticated user`, () => {
        request(app.getHttpServer()).get(endpoint).expect(401);
      });

      it(`(POST) should return 201 created when user has maintainer role`, async () => {
        const data = {
          difficulty: {
            name: MOCK_DIFFICULTY_1,
          },
        };

        const { body } = await request(app.getHttpServer())
          .post(endpoint)
          .send(data)
          .set('Authorization', `Bearer ${MOCK_ADMIN_TOKEN}`)
          .expect(201);

        mockDifficultyId = body._id;

        expect(body).toEqual(
          expect.objectContaining({
            _id: mockDifficultyId,
            name: MOCK_DIFFICULTY_1,
          }),
        );
      });

      it(`(POST) should return 401 unauthorized when user has non-maintainer role`, () => {
        const data = {
          difficulty: {
            name: MOCK_DIFFICULTY_2,
          },
        };

        request(app.getHttpServer())
          .post(endpoint)
          .send(data)
          .set('Authorization', `Bearer ${MOCK_USER_1_TOKEN}`)
          .expect(401);
      });

      it(`(DELETE) should return 401 unauthorized when user has non-maintainer role`, () => {
        request(app.getHttpServer())
          .post(`${endpoint}/${mockDifficultyId}`)
          .set('Authorization', `Bearer ${MOCK_USER_1_TOKEN}`)
          .expect(401);
      });

      it(`(DELETE) should return 200 OK when user has maintainer role`, async () => {
        const { text } = await request(app.getHttpServer())
          .delete(`${endpoint}/${mockDifficultyId}`)
          .set('Authorization', `Bearer ${MOCK_ADMIN_TOKEN}`)
          .expect(200);
        expect(text).toEqual(mockDifficultyId);
      });
    });

    describe('/questions', () => {
      const endpoint = `${prefix}/questions`;
      let mockQuestionId: string;
      let mockDifficultyId: string;
      const mockCategoryIds: string[] = [];

      beforeAll(async () => {
        await Promise.all(
          MOCK_QUESTION_1.categories.map(async (category) => {
            const categoryData = {
              category: {
                name: category,
              },
            };
            const { body: createCategoryBody } = await request(
              app.getHttpServer(),
            )
              .post(`${prefix}/categories`)
              .send(categoryData)
              .set('Authorization', `Bearer ${MOCK_ADMIN_TOKEN}`);
            mockCategoryIds.push(createCategoryBody._id);
          }),
        );

        const difficultyData = {
          difficulty: {
            name: MOCK_QUESTION_1.difficulty,
          },
        };
        const { body: createDifficultyBody } = await request(
          app.getHttpServer(),
        )
          .post(`${prefix}/difficulties`)
          .send(difficultyData)
          .set('Authorization', `Bearer ${MOCK_ADMIN_TOKEN}`);
        mockDifficultyId = createDifficultyBody._id;
      });

      it(`(GET) should return 200 OK with authenticated user`, async () => {
        const { body } = await request(app.getHttpServer())
          .get(endpoint)
          .set('Authorization', `Bearer ${MOCK_USER_1_TOKEN}`)
          .expect(200);

        expect(body).toHaveLength(20);
      });

      it(`(GET) should return 401 unauthorized with unauthenticated user`, () => {
        request(app.getHttpServer()).get(endpoint).expect(401);
      });

      it(`(POST) should return 401 unauthorized when user has non-maintainer role`, () => {
        const data = {
          question: MOCK_QUESTION_1,
        };

        request(app.getHttpServer())
          .post(endpoint)
          .send(data)
          .set('Authorization', `Bearer ${MOCK_USER_1_TOKEN}`)
          .expect(401);
      });

      it(`(POST) should return 201 created when user has maintainer role`, async () => {
        const data = {
          question: MOCK_QUESTION_1,
        };

        const { body } = await request(app.getHttpServer())
          .post(endpoint)
          .send(data)
          .set('Authorization', `Bearer ${MOCK_ADMIN_TOKEN}`)
          .expect(201);

        mockQuestionId = body._id;

        expect(body).toEqual(
          expect.objectContaining({
            _id: body._id,
            ...data.question,
          }),
        );
      });

      it(`(POST) should return 401 unauthorized when category or difficulty does not exist`, () => {
        const data = {
          question: MOCK_QUESTION_2,
        };

        request(app.getHttpServer())
          .post(endpoint)
          .send(data)
          .set('Authorization', `Bearer ${MOCK_ADMIN_TOKEN}`)
          .expect(401);
      });

      it(`(GET) specific question should return 200 OK with authenticated user`, async () => {
        const { body } = await request(app.getHttpServer())
          .get(`${endpoint}/${mockQuestionId}`)
          .set('Authorization', `Bearer ${MOCK_USER_1_TOKEN}`)
          .expect(200);

        expect(body).toEqual(
          expect.objectContaining({
            _id: body._id,
            ...MOCK_QUESTION_1,
          }),
        );
      });

      it(`(GET) specific question should return 401 unauthorized with unauthenticated user`, () => {
        request(app.getHttpServer())
          .get(`${endpoint}/${mockQuestionId}`)
          .expect(401);
      });

      it(`(PATCH) should return 401 unauthorized when user has non-maintainer role`, () => {
        request(app.getHttpServer())
          .patch(`${endpoint}/${mockQuestionId}`)
          .send({ question: MOCK_QUESTION_2 })
          .set('Authorization', `Bearer ${MOCK_USER_1_TOKEN}`)
          .expect(401);
      });

      it(`(PATCH) should return 200 OK when user has maintainer role`, async () => {
        const { body } = await request(app.getHttpServer())
          .patch(`${endpoint}/${mockQuestionId}`)
          .send({
            question: {
              title: MOCK_QUESTION_1.title,
              description: MOCK_QUESTION_2.description,
              difficulty: MOCK_QUESTION_1.difficulty,
              categories: MOCK_QUESTION_1.categories,
            },
          })
          .set('Authorization', `Bearer ${MOCK_ADMIN_TOKEN}`)
          .expect(200);

        expect(body).toEqual(
          expect.objectContaining({
            _id: body._id,
            ...MOCK_QUESTION_1,
            description: MOCK_QUESTION_2.description,
          }),
        );
      });

      it(`(DELETE) should return 401 unauthorized when user has non-maintainer role`, () => {
        request(app.getHttpServer())
          .post(`${endpoint}/${mockQuestionId}`)
          .set('Authorization', `Bearer ${MOCK_USER_1_TOKEN}`)
          .expect(401);
      });

      it(`(DELETE) should return 200 OK when user has maintainer role`, async () => {
        const { text } = await request(app.getHttpServer())
          .delete(`${endpoint}/${mockQuestionId}`)
          .set('Authorization', `Bearer ${MOCK_ADMIN_TOKEN}`)
          .expect(200);

        expect(text).toEqual(mockQuestionId);
      });

      afterAll(async () => {
        await Promise.all(
          mockCategoryIds.map(async (categoryId) => {
            await request(app.getHttpServer())
              .delete(`${prefix}/categories/${categoryId}`)
              .set('Authorization', `Bearer ${MOCK_ADMIN_TOKEN}`);
          }),
        );
        await request(app.getHttpServer())
          .delete(`${prefix}/difficulties/${mockDifficultyId}`)
          .set('Authorization', `Bearer ${MOCK_ADMIN_TOKEN}`);
      });
    });
  });

  describe('/languages', () => {
    const endpoint = '/languages';

    it(`(GET) should return 200 OK with authenticated user`, async () => {
      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .set('Authorization', `Bearer ${MOCK_USER_1_TOKEN}`)
        .expect(200);

      expect(body).toHaveLength(2);
    });

    it(`(GET) should return 401 unauthorized with unauthenticated user`, () => {
      request(app.getHttpServer()).get(endpoint).expect(401);
    });
  });

  describe('/matching', () => {
    let ws1: WebSocket;
    let ws2: WebSocket;
    let wsTicket1: string;
    let wsTicket2: string;
    const mockCategoryIds: string[] = [];
    let mockDifficultyId: string;
    let mockQuestionId: string;
    const websocketUrl = `ws://localhost:${process.env.HTTP_GATEWAY_PORT}/matching`;

    beforeAll(async () => {
      await Promise.all(
        MOCK_QUESTION_1.categories.map(async (category) => {
          const categoryData = {
            category: {
              name: category,
            },
          };
          const { body: createCategoryBody } = await request(
            app.getHttpServer(),
          )
            .post(`/question/categories`)
            .send(categoryData)
            .set('Authorization', `Bearer ${MOCK_ADMIN_TOKEN}`);
          mockCategoryIds.push(createCategoryBody._id);
        }),
      );

      const difficultyData = {
        difficulty: {
          name: MOCK_QUESTION_1.difficulty,
        },
      };
      const { body: createDifficultyBody } = await request(app.getHttpServer())
        .post(`/question/difficulties`)
        .send(difficultyData)
        .set('Authorization', `Bearer ${MOCK_ADMIN_TOKEN}`);
      mockDifficultyId = createDifficultyBody._id;

      const questionData = {
        question: MOCK_QUESTION_1,
      };
      const { body: createQuestionBody } = await request(app.getHttpServer())
        .post(`/question/questions`)
        .send(questionData)
        .set('Authorization', `Bearer ${MOCK_ADMIN_TOKEN}`);
      mockQuestionId = createQuestionBody._id;

      const { body: ticket1 } = await request(app.getHttpServer())
        .get(`/auth/ticket`)
        .set('Authorization', `Bearer ${MOCK_USER_1_TOKEN}`);
      const { body: ticket2 } = await request(app.getHttpServer())
        .get(`/auth/ticket`)
        .set('Authorization', `Bearer ${MOCK_ADMIN_TOKEN}`);
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
      const userSessions = [];
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
    });
  });

  describe('/user', () => {
    const endpoint = '/user';
    it(`(GET) should return 200 OK with authenticated user`, async () => {
      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .set('Authorization', `Bearer ${MOCK_USER_1_TOKEN}`)
        .expect(200);
      expect(body).toEqual(
        expect.objectContaining({
          name: MOCK_USER_1_PROFILE.name,
          username: MOCK_USER_1_PROFILE.username,
          preferredLanguageId: MOCK_USER_1_PROFILE.preferredLanguageId,
          preferredLanguage: MOCK_USER_1_PROFILE.preferredLanguage,
          roleId: MOCK_USER_1_PROFILE.roleId,
          role: MOCK_USER_1_PROFILE.role,
        }),
      );
    });

    it(`(GET) should return 401 unauthorized with unauthenticated user`, () => {
      request(app.getHttpServer()).get(endpoint).expect(401);
    });

    it(`(GET) specific user should return 200 OK with authenticated user`, async () => {
      const { body } = await request(app.getHttpServer())
        .get(`${endpoint}/${MOCK_ADMIN_USER_PROFILE.username}`)
        .set('Authorization', `Bearer ${MOCK_USER_1_TOKEN}`)
        .expect(200);
      expect(body).toEqual(
        expect.objectContaining({
          name: MOCK_ADMIN_USER_PROFILE.name,
          username: MOCK_ADMIN_USER_PROFILE.username,
          preferredLanguageId: MOCK_ADMIN_USER_PROFILE.preferredLanguageId,
          preferredLanguage: MOCK_ADMIN_USER_PROFILE.preferredLanguage,
          roleId: MOCK_ADMIN_USER_PROFILE.roleId,
          role: MOCK_ADMIN_USER_PROFILE.role,
        }),
      );
    });

    it(`(GET) specific user should return 401 unauthorized with unauthenticated user`, () => {
      request(app.getHttpServer())
        .get(`${endpoint}/${MOCK_ADMIN_USER_PROFILE.username}`)
        .expect(401);
    });

    it(`(PATCH) should return 200 OK with authenticated user`, async () => {
      const { body } = await request(app.getHttpServer())
        .patch(endpoint)
        .send({
          preferredLanguageId: Language.JAVASCRIPT,
        })
        .set('Authorization', `Bearer ${MOCK_USER_1_TOKEN}`)
        .expect(200);
      expect(body).toEqual(
        expect.objectContaining({
          ...MOCK_USER_1_PROFILE,
          preferredLanguageId: Language.JAVASCRIPT,
          preferredLanguage: {
            id: Language.JAVASCRIPT,
            name: Language[Language.JAVASCRIPT],
          },
          userId: MOCK_USER_1_UUID,
        }),
      );
    });

    it(`(DELETE) should return 200 OK with authenticated user`, async () => {
      const { body } = await request(app.getHttpServer())
        .delete(endpoint)
        .set('Authorization', `Bearer ${MOCK_USER_1_TOKEN}`)
        .expect(200);
      expect(body).toEqual(expect.objectContaining({ deletedCount: 1 }));
    });
  });
});
