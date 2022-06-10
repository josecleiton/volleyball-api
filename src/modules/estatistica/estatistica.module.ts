import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '../core/core.module';
import { LigaModule } from '../liga/liga.module';
import { PartidaModule } from '../partida/partida.module';
import { PessoaModule } from '../pessoa/pessoa.module';
import { SmsModule } from '../sms/sms.module';
import {
  FundamentoAtletaController,
  MelhorCentralController,
  MelhorLiberoController,
} from './controllers';
import { MelhorPontaController } from './controllers/melhor-ponta.controller';
import { VotoDaGaleraController } from './controllers/voto-da-galera.controller';
import {
  FundamentoAtletaRepository,
  MelhorCentralViewRepository,
  MelhorLiberoViewRepository,
  MelhorPontaViewRepository,
  VotoDaGaleraRepository,
} from './repositories';
import {
  FundamentoAtletaService,
  MelhorCentralService,
  MelhorLiberoService,
  MelhorPontaService,
  VotoDaGaleraService,
} from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FundamentoAtletaRepository,
      MelhorLiberoViewRepository,
      MelhorCentralViewRepository,
      MelhorPontaViewRepository,
      VotoDaGaleraRepository,
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
    MelhorPontaController,
    VotoDaGaleraController,
  ],
  providers: [
    FundamentoAtletaService,
    MelhorLiberoService,
    MelhorCentralService,
    MelhorPontaService,
    VotoDaGaleraService,
  ],
})
export class EstatisticaModule {}
