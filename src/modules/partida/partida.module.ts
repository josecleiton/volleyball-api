import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmExModule } from '../core';
import { LigaModule } from '../liga';
import { PessoaModule } from '../pessoa';
import { PontuacaoViewRepository, PontuacaoModule } from '../pontuacao';
import { SalvaPartidaFacade } from './facades';
import { PartidaFactory } from './factories';
import { PartidaController } from './partida.controller';
import {
  PartidaRepository,
  ArbitroPartidaRepository,
  AtletaEscaladoRepository,
  EquipePartidaRepository,
} from './repositories';
import { PartidaService, AtletaEscaladoService } from './services';

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
