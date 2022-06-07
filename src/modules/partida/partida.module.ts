import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PartidaController } from './partida.controller';
import { PartidaRepository } from './repositories/partida.repository';
import { ArbitroPartidaRepository } from './repositories/arbitro-partida.repository';
import { AtletaEscaladoRepository } from './repositories/atleta-escalado.repository';
import { ParticipacaoPartidaRepository } from './repositories/participacao-partida.repository';
import { PessoaModule } from '../pessoa/pessoa.module';
import { LigaModule } from '../liga/liga.module';
import { AtletaEscaladoService, PartidaService } from './services';
import { PontuacaoModule } from '../pontuacao/pontuacao.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PartidaRepository,
      ArbitroPartidaRepository,
      AtletaEscaladoRepository,
      ParticipacaoPartidaRepository,
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
