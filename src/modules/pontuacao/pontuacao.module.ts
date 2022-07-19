import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmExModule } from '../core';
import { PartidaModule } from '../partida';
import { RegistraResultadoPartidaFacade } from './facades';
import { PontuacaoController } from './pontuacao.controller';
import { PontuacaoViewRepository } from './repositories';
import {
  PontuacaoService,
  AplicaRegraDesempateService,
  RegistraDesistenciaService,
} from './services';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([PontuacaoViewRepository]),
    forwardRef(() => PartidaModule),
  ],
  controllers: [PontuacaoController],
  providers: [
    PontuacaoService,
    AplicaRegraDesempateService,
    RegistraDesistenciaService,
    RegistraResultadoPartidaFacade,
  ],
  exports: [
    PontuacaoService,
    RegistraDesistenciaService,
    RegistraResultadoPartidaFacade,
  ],
})
export class PontuacaoModule {}
