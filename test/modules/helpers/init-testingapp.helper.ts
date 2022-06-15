import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/modules/app/app.module';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { stubDatabaseConnection } from './stub-database-connection.helper';

export async function initTestingApp() {
  const moduleFixture = await stubDatabaseConnection(
    Test.createTestingModule({
      imports: [AppModule],
    }),
  ).then((builder) => builder.compile());

  const app = moduleFixture.createNestApplication();
  const config = app.get(ConfigService);

  return app
    .useGlobalPipes(new ValidationPipe(config.get('validation')))
    .useGlobalFilters(new HttpExceptionFilter(config))
    .init();
}
