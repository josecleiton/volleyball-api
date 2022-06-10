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
import { MelhorPontaController } from './controllers/melhor-ponta.controller';
import {
  FundamentoAtletaRepository,
  MelhorCentralViewRepository,
  MelhorLiberoViewRepository,
  MelhorPontaViewRepository,
} from './repositories';
import {
  FundamentoAtletaService,
  MelhorCentralService,
  MelhorLiberoService,
  MelhorPontaService,
} from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FundamentoAtletaRepository,
      MelhorLiberoViewRepository,
      MelhorCentralViewRepository,
      MelhorPontaViewRepository,
    ]),
    CoreModule,
    PartidaModule,
    LigaModule,
  ],
  controllers: [
    FundamentoAtletaController,
    MelhorLiberoController,
    MelhorCentralController,
    MelhorPontaController,
  ],
  providers: [
    FundamentoAtletaService,
    MelhorLiberoService,
    MelhorCentralService,
    MelhorPontaService,
  ],
})
export class EstatisticaModule {}
