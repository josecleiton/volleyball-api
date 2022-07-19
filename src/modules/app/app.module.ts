import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  appConfig,
  databaseConfig,
  corsConfig,
  rateLimitConfig,
  validationPipeConfig,
} from 'src/configs';
import { CoreModule, getModuleThrottlerProvider } from '../core';
import { EquipeModule } from '../equipe';
import { EstatisticaModule } from '../estatistica';
import { GinasioModule } from '../ginasio';
import { LigaModule } from '../liga';
import { PartidaModule } from '../partida';
import { PessoaModule } from '../pessoa';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
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
