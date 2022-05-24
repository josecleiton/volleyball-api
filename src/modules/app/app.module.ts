import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  appConfig,
  corsConfig,
  rateLimitConfig,
  databaseConfig,
} from '../../configs';
import { LigaModule } from '../liga/liga.module';

import { CoreModule } from '../core/core.module';
import { EquipeModule } from '../equipe/equipe.module';
import { GinasioModule } from '../ginasio/ginasio.module';
import { PartidaModule } from '../partida/partida.module';
import { PessoaModule } from '../pessoa/pessoa.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('database') ?? {},
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig, corsConfig, rateLimitConfig],
    }),
    CoreModule,
    EquipeModule,
    PessoaModule,
    LigaModule,
    GinasioModule,
    PartidaModule,
  ],
})
export class AppModule {}
