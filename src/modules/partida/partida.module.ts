import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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

@Module({
  imports: [
    TypeOrmModule.forFeature([
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
  providers: [PartidaService, AtletaEscaladoService],
  exports: [TypeOrmModule, PartidaService, AtletaEscaladoService],
})
export class PartidaModule {}
