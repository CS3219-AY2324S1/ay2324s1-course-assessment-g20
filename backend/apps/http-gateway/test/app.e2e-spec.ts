import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as dotenv from 'dotenv';
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
  MOCK_USER_2,
} from '@app/mocks';
import { Service } from '@app/microservice/services';
import { ClientGrpc } from '@nestjs/microservices';
import {
  USER_AUTH_SERVICE_NAME,
  UserAuthServiceClient,
} from '@app/microservice/interfaces/user';
import { firstValueFrom } from 'rxjs';
import { Language } from '@app/types/languages';

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
    await app.init();
  });

  // Generate access tokens for mock users
  let MOCK_ADMIN_TOKEN: string;
  let MOCK_USER_1_TOKEN: string;
  let MOCK_USER_1_REFRESH_TOKEN: string;
  let MOCK_USER_2_TOKEN: string;
  beforeEach(async () => {
    const userServiceClient: ClientGrpc = app.get(Service.USER_SERVICE);
    const userAuthService = userServiceClient.getService<UserAuthServiceClient>(
      USER_AUTH_SERVICE_NAME,
    );
    const { accessToken: adminAccessToken } = await firstValueFrom(
      userAuthService.generateJwts(MOCK_ADMIN_USER),
    );
    const { accessToken: user1Token, refreshToken: user1RefreshToken } =
      await firstValueFrom(userAuthService.generateJwts(MOCK_USER_1));
    const { accessToken: user2Token } = await firstValueFrom(
      userAuthService.generateJwts(MOCK_USER_2),
    );
    MOCK_ADMIN_TOKEN = adminAccessToken;
    MOCK_USER_1_TOKEN = user1Token;
    MOCK_USER_1_REFRESH_TOKEN = user1RefreshToken;
    MOCK_USER_2_TOKEN = user2Token;
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
        .get(`${endpoint}/username/${MOCK_ADMIN_USER_PROFILE.username}`)
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
        .set('Authorization', `Bearer ${MOCK_USER_2_TOKEN}`)
        .expect(200);
      expect(body).toEqual(expect.objectContaining({ deletedCount: 1 }));
    });
  });
});
