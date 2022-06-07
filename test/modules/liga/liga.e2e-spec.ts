import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/modules/app/app.module';
import { criaLigaDto } from 'test/__MOCKS__/liga/liga.mock';
import { stubDatabaseConnection } from '../helpers';

describe('LigaController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await stubDatabaseConnection(
      Test.createTestingModule({
        imports: [AppModule],
      }),
    ).then((builder) => builder.compile());

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/liga (POST)', async () => {
    const body = criaLigaDto();
    const res = await request(app.getHttpServer())
      .post('/liga')
      .send(body)
      .expect(201)
      .expect('Content-Type', /json/);

    expect(res.body).toEqual(expect.objectContaining(body));
  });
});
