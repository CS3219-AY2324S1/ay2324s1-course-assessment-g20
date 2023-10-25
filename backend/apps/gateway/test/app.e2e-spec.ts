import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { WsAdapter } from '@nestjs/platform-ws';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  // Test
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useWebSocketAdapter(new WsAdapter(app));
    await app.init();
  });

  it('/auth/google (GET)', () => {
    return request(app.getHttpServer()).get('/auth/google').expect(302);
  });

  it('/question/questions (GET)', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/question/questions')
      .expect(200);

    expect(body).toHaveLength(20);
  });
});
