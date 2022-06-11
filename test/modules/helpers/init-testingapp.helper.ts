import { Test } from '@nestjs/testing';
import { AppModule } from 'src/modules/app/app.module';
import { stubDatabaseConnection } from './stub-database-connection.helper';

export async function initTestingApp() {
  const moduleFixture = await stubDatabaseConnection(
    Test.createTestingModule({
      imports: [AppModule],
    }),
  ).then((builder) => builder.compile());

  const app = moduleFixture.createNestApplication();

  await app.init();

  return app;
}
