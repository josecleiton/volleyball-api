import { Logger, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppConfig } from './configs';
import { HttpExceptionFilter } from './filters';
import { AppModule } from './modules/app';

const logger = new Logger('bootstrap');

function buildSwaggerDoc(app: INestApplication, config: ConfigService) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { name, description, version } = config.get<AppConfig>('app')!;
  const options = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)
    .build();
  const docsPath = config.get('SWAGGER_PATH', 'docs');
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(docsPath, app, document);
  logger.log(`Docs generated in /${docsPath} using Swagger (OpenAPI)`);
}

function applySecurityLayer(
  app: NestExpressApplication,
  config: ConfigService,
) {
  app.use(helmet());
  app.enableCors(config.get('cors'));
  logger.log('Security layer applied to the app');
}

function applyGlobals(app: INestApplication, config: ConfigService) {
  app
    .useGlobalFilters(new HttpExceptionFilter(config))
    .useGlobalPipes(new ValidationPipe(config.get('validation')));
  logger.log('Global config applied');

  return app;
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const defaultPort = 3000;
  const PORT = parseInt(configService.get('PORT') ?? '5000') ?? defaultPort;
  applySecurityLayer(app, configService);
  applyGlobals(app, configService);
  buildSwaggerDoc(app, configService);
  if (PORT === defaultPort) {
    logger.warn(`App using default port :${defaultPort}`);
  }
  await app.listen(PORT, '0.0.0.0');
  logger.log(`App listening to port :${PORT}`);
  logger.log(`App running on: ${await app.getUrl()}`);
}

bootstrap();
