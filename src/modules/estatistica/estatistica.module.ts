import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '../core/core.module';
import { LigaModule } from '../liga/liga.module';
import { PartidaModule } from '../partida/partida.module';
import {
  FundamentoAtletaController,
  MelhorLiberoController,
} from './controllers';
import {
  FundamentoAtletaRepository,
  MelhorLiberoViewRepository,
} from './repositories';
import { FundamentoAtletaService, MelhorLiberoService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FundamentoAtletaRepository,
      MelhorLiberoViewRepository,
    ]),
    CoreModule,
    PartidaModule,
    LigaModule,
  ],
  controllers: [FundamentoAtletaController, MelhorLiberoController],
  providers: [FundamentoAtletaService, MelhorLiberoService],
})
export class EstatisticaModule {}
