import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { appConfig } from '../../configs/app.config';
import { cacheConfig } from '../../configs/cache.config';
import { corsConfig } from '../../configs/cors.config';
import { rateLimitConfig } from '../../configs/rate-limit.config';
import { CoreModule } from '../core/core.module';
import { EquipeModule } from '../equipe/equipe.module';
import { PessoaModule } from '../pessoa/pessoa.module';


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
    CoreModule,
    EquipeModule,
    PessoaModule,
  ],
})
export class AppModule {}

