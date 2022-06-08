import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '../core/core.module';
import { LigaModule } from '../liga/liga.module';
import { PartidaModule } from '../partida/partida.module';
import {
  FundamentoAtletaController,
  MelhorCentralController,
  MelhorLiberoController,
} from './controllers';
import {
  FundamentoAtletaRepository,
  MelhorCentralViewRepository,
  MelhorLiberoViewRepository,
} from './repositories';
import {
  FundamentoAtletaService,
  MelhorCentralService,
  MelhorLiberoService,
} from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FundamentoAtletaRepository,
      MelhorLiberoViewRepository,
      MelhorCentralViewRepository,
    ]),
    CoreModule,
    PartidaModule,
    LigaModule,
  ],
  controllers: [
    FundamentoAtletaController,
    MelhorLiberoController,
    MelhorCentralController,
  ],
  providers: [
    FundamentoAtletaService,
    MelhorLiberoService,
    MelhorCentralService,
  ],
})
export class EstatisticaModule {}
