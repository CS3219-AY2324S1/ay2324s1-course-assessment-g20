import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as dotenv from 'dotenv';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { GoogleOauthStrategy } from '../src/oauthProviders/google/google-oauth.strategy';
// import { MockGoogleOAuthStrategy } from './google-oauth.strategy.mock';
import { getMockGoogleOAuthStrategy } from './google-oauth.strategy.mock';
import { MockGoogleOauthGuard } from './google-oauth.guard.mock';
import { GoogleOauthGuard } from '../src/oauthProviders/google/google-oauth.guard';
import authConfiguration from '../src/config/configuration';
import questionConfiguration from '../src/config/configuration';
import knex from 'knex';
import authKnexConfig from '../../auth/knexfile';
import questionKnexConfig from '../../question/knexfile';
import { get } from 'http';

dotenv.config({ path: '.env.test' });
describe('Backend (e2e)', () => {
  /* ================ Setup ================ */
  let app: INestApplication;
  let authServiceClient: ClientProxy;
  let questionServiceClient: ClientProxy;
  let knexAuthDatabaseInstance;
  let knexQuestionDatabaseInstance;

  const getKnexConfig = (knexConfig?, database?: string) => ({
    ...knexConfig,
    connection: {
      ...knexConfig.connection,
      database: database,
    },
  });

  const AUTH_DATABASE_NAME = 'peer-prep-auth-service';
  const QUESTION_DATABASE_NAME = 'peer-prep-question-service';
  const knexAuthDatabaseConfig = getKnexConfig(
    authKnexConfig,
    AUTH_DATABASE_NAME,
  );
  const knexQuestionDatabaseConfig = getKnexConfig(
    questionKnexConfig,
    QUESTION_DATABASE_NAME,
  );

  const createBaseTestingModule = () =>
    Test.createTestingModule({
      imports: [
        AppModule,
        // ClientsModule.register([
        //   {
        //     name: 'QUESTION_SERVICE',
        //     transport: Transport.TCP,
        //     options: {
        //       host: '0.0.0.0',
        //       port: questionConfiguration().port,
        //     }
        //   },
        //   {
        //     name: 'AUTH_SERVICE',
        //     transport: Transport.TCP,
        //     options: {
        //       host: '0.0.0.0',
        //       port: authConfiguration().port,
        //     }
        //   },
        // ]),
      ],
    })
      .overrideGuard(GoogleOauthGuard)
      .useValue(new MockGoogleOauthGuard())
      .overrideProvider(GoogleOauthStrategy)
      .useValue(getMockGoogleOAuthStrategy());

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await createBaseTestingModule().compile();

    app = moduleFixture.createNestApplication();
    // await app.connectMicroservice({
    //   transport: Transport.TCP,
    // });
    // await app.startAllMicroservices();
    await app.init();
    // questionServiceClient = app.get('QUESTION_SERVICE');
    // await questionServiceClient.connect();
    // authServiceClient = app.get('AUTH_SERVICE');
    // await authServiceClient.connect();
    knexAuthDatabaseInstance = knex(knexAuthDatabaseConfig);
    knexQuestionDatabaseInstance = knex(knexQuestionDatabaseConfig);
  });

  /* ================ Teardown ================ */
  afterAll(async () => {
    await app.close();
    // authServiceClient.close();
    // questionServiceClient.close();
  });

  /* ================ Tests ================ */
  describe('AppController (e2e)', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  describe('Gateway (e2e)', () => {
    const prefix = '/auth';

    it(`${prefix} (GET)`, () => {
      return request(app.getHttpServer())
        .get(prefix)
        .expect(200)
        .expect('Hello World!');
    });

    it(`${prefix}/google (GET)`, () => {
      return request(app.getHttpServer()).get(`${prefix}/google`).expect(200);
    });

    // it(`${prefix}/google/redirect (GET)`, async () => {
    //   await request(app.getHttpServer())
    //     .get(`${prefix}/google/redirect`)
    //     .expect(302)
    //     .expect(
    //       'Location',
    //       /http:\/\/localhost:3000\/authRedirect\?accessToken=.+&refreshToken=.*/,
    //     );

    //   const insertedUser = await knexAuthDatabaseInstance
    //     .select()
    //     .from('users')
    //     .where('authProviderId', 'auth_provider_id')
    //     .first();

    //   expect(insertedUser).toEqual(
    //     expect.objectContaining({
    //       id: expect.anything(),
    //       authProvider: 'google',
    //       authProviderId: 'auth_provider_id',
    //       email: 'test@gmail.com',
    //       oauthName: 'first_name last_name',
    //     }),
    //   );
    // });
  });
});
