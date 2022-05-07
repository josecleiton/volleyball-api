import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { appConfig } from '../../configs/app.config';
import { cacheConfig } from '../../configs/cache.config';
import { corsConfig } from '../../configs/cors.config';
import { rateLimitConfig } from '../../configs/rate-limit.config';

import { AppController } from './controllers/app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        appConfig,
        cacheConfig,
        corsConfig,
        rateLimitConfig,
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

