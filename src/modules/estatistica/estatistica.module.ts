import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { TypeOrmExModule } from '../core/typeorm-ex/typeorm-ex.module';
import { LigaModule } from '../liga/liga.module';
import { PartidaModule } from '../partida/partida.module';
import { PessoaModule } from '../pessoa/pessoa.module';
import { SmsModule } from '../sms/sms.module';
import {
  CraqueDaGaleraController,
  FundamentoAtletaController,
  MelhorCentralController,
  MelhorLiberoController,
} from './controllers';
import { MelhorOpostoController } from './controllers/melhor-oposto.controller';
import { VotoDaGaleraController } from './controllers/voto-da-galera.controller';
import {
  CraqueDaGaleraViewRepository,
  FundamentoAtletaRepository,
  MelhorCentralViewRepository,
  MelhorLiberoViewRepository,
  MelhorOpostoViewRepository,
  VotoDaGaleraRepository,
} from './repositories';
import {
  CraqueDaGaleraService,
  FundamentoAtletaService,
  MelhorCentralService,
  MelhorLiberoService,
  MelhorOpostoService,
  VotoDaGaleraService,
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
