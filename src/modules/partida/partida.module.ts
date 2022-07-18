import { forwardRef, Module } from '@nestjs/common';

import { PartidaController } from './partida.controller';
import { PessoaModule } from '../pessoa/pessoa.module';
import { LigaModule } from '../liga/liga.module';
import { AtletaEscaladoService, PartidaService } from './services';
import { PontuacaoModule } from '../pontuacao/pontuacao.module';
import {
  ArbitroPartidaRepository,
  AtletaEscaladoRepository,
  EquipePartidaRepository,
  PartidaRepository,
} from './repositories';
import { PontuacaoViewRepository } from '../pontuacao/repositories/pontuacao-view.repository';
import { PartidaFactory } from './factories/partida.factory';
import { SalvaPartidaFacade } from './facades/salva-partida.facade';
import { TypeOrmExModule } from '../core/typeorm-ex/typeorm-ex.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      PartidaRepository,
      ArbitroPartidaRepository,
      AtletaEscaladoRepository,
      EquipePartidaRepository,
      PontuacaoViewRepository,
    ]),
    PessoaModule,
    forwardRef(() => LigaModule),
    PontuacaoModule,
  ],
  controllers: [PartidaController],
  providers: [
    PartidaService,
    AtletaEscaladoService,
    PartidaFactory,
    SalvaPartidaFacade,
  ],
  exports: [
    TypeOrmExModule,
    PartidaService,
    AtletaEscaladoService,
    PartidaFactory,
    SalvaPartidaFacade,
  ],
})
export class PartidaModule {}
