import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  appConfig,
  corsConfig,
  rateLimitConfig,
  databaseConfig,
  validationPipeConfig,
} from '../../configs';
import { LigaModule } from '../liga/liga.module';

import { CoreModule } from '../core/core.module';
import { EquipeModule } from '../equipe/equipe.module';
import { GinasioModule } from '../ginasio/ginasio.module';
import { PartidaModule } from '../partida/partida.module';
import { PessoaModule } from '../pessoa/pessoa.module';
import { EstatisticaModule } from '../estatistica/estatistica.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { getModuleThrottlerProvider } from '../core/guards';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('database') ?? {},
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      load: [
        appConfig,
        databaseConfig,
        corsConfig,
        rateLimitConfig,
        validationPipeConfig,
      ],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('rateLimit') ?? { ttl: 60, max: 10 },
      inject: [ConfigService],
    }),
    CoreModule,
    EquipeModule,
    PessoaModule,
    LigaModule,
    GinasioModule,
    PartidaModule,
    EstatisticaModule,
  ],
  controllers: [AppController],
  providers: [getModuleThrottlerProvider()],
})
export class AppModule {}
