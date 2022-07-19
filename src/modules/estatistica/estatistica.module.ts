import { Module } from '@nestjs/common';
import { TypeOrmExModule, CoreModule } from '../core';
import { LigaModule } from '../liga';
import { PartidaModule } from '../partida';
import { PessoaModule } from '../pessoa';
import { SmsModule } from '../sms';
import {
  FundamentoAtletaController,
  MelhorLiberoController,
  MelhorCentralController,
  MelhorOpostoController,
  VotoDaGaleraController,
  CraqueDaGaleraController,
} from './controllers';
import {
  FundamentoAtletaRepository,
  MelhorLiberoViewRepository,
  MelhorCentralViewRepository,
  MelhorOpostoViewRepository,
  VotoDaGaleraRepository,
  CraqueDaGaleraViewRepository,
} from './repositories';
import {
  FundamentoAtletaService,
  MelhorLiberoService,
  MelhorCentralService,
  MelhorOpostoService,
  VotoDaGaleraService,
  CraqueDaGaleraService,
} from './services';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      FundamentoAtletaRepository,
      MelhorLiberoViewRepository,
      MelhorCentralViewRepository,
      MelhorOpostoViewRepository,
      VotoDaGaleraRepository,
      CraqueDaGaleraViewRepository,
    ]),
    CoreModule,
    PartidaModule,
    LigaModule,
    PessoaModule,
    SmsModule,
  ],
  controllers: [
    FundamentoAtletaController,
    MelhorLiberoController,
    MelhorCentralController,
    MelhorOpostoController,
    VotoDaGaleraController,
    CraqueDaGaleraController,
  ],
  providers: [
    FundamentoAtletaService,
    MelhorLiberoService,
    MelhorCentralService,
    MelhorOpostoService,
    VotoDaGaleraService,
    CraqueDaGaleraService,
  ],
})
export class EstatisticaModule {}
