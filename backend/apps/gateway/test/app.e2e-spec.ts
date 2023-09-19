import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as dotenv from 'dotenv';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { GoogleOauthStrategy } from '../src/oauthProviders/google/google-oauth.strategy';
import { MockGoogleOAuthStrategy } from './google-oauth.strategy.mock';
import { MockGoogleOauthGuard } from './google-oauth.guard.mock';
import { GoogleOauthGuard } from '../src/oauthProviders/google/google-oauth.guard';

dotenv.config({ path: '.env.test' });
describe('Backend (e2e)', () => {
  /* ================ Setup ================ */
  let app: INestApplication;
  let authServiceClient: ClientProxy;

  const createBaseTestingModule = () =>
    Test.createTestingModule({
      imports: [
        AppModule,
        ClientsModule.register([
          {
            name: 'AUTH_SERVICE',
            transport: Transport.TCP,
          },
        ]),
      ],
    })
      .overrideGuard(GoogleOauthGuard)
      .useValue(MockGoogleOauthGuard)
      .overrideProvider(GoogleOauthStrategy)
      .useValue(MockGoogleOAuthStrategy);

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await createBaseTestingModule().compile();

    app = moduleFixture.createNestApplication();
    app.connectMicroservice({
      transport: Transport.TCP,
    });
    await app.startAllMicroservices();
    await app.init();
    authServiceClient = app.get('AUTH_SERVICE');
    await authServiceClient.connect();
  });

  /* ================ Teardown ================ */
  afterAll(async () => {
    await app.close();
    authServiceClient.close();
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
    //   console.log('before sending google redirect');
    //   await request(app.getHttpServer())
    //     .get(`${prefix}/google/redirect`)
    //     .expect(302)
    //     .expect(
    //       'Location',
    //       /http:\/\/localhost:3000\/authRedirect\?accessToken=.+&refreshToken=.*/,
    //     );

    //   const insertedUser = await firstValueFrom(
    //     authServiceClient.send('find_or_create_oauth_user', {
    //       authProviderId: MOCK_GOOGLE_USER.id,
    //     }),
    //   );

    //   expect(insertedUser).toEqual(
    //     expect.objectContaining({
    //       id: expect.anything(),
    //       authProvider: 'google',
    //       authProviderId: 'auth_provider_id',
    //       email: 'email',
    //       oauthName: 'first_name last_name',
    //     }),
    //   );
    // });
  });
});
