import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartidaModule } from '../partida/partida.module';
import { RegistraResultadoPartidaFacade } from './facades';
import { PontuacaoController } from './pontuacao.controller';
import { PontuacaoViewRepository } from './repositories/pontuacao-view.repository';
import {
  AplicaRegraDesempateService,
  PontuacaoService,
  RegistraDesistenciaService,
} from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([PontuacaoViewRepository]),
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
