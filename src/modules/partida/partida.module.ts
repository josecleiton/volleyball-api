import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PartidaService } from './partida.service';
import { PartidaController } from './partida.controller';
import { PartidaRepository } from './repositories/partida.repository';
import { ArbitroPartidaRepository } from './repositories/arbitro-partida.repository';
import { AtletaPartidaRepository } from './repositories/atleta-partida.repository';
import { PontuacaoPartidaRepository } from './repositories/pontuacao-partida.repository';
import { PessoaModule } from '../pessoa/pessoa.module';
import { LigaModule } from '../liga/liga.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PartidaRepository,
      ArbitroPartidaRepository,
      AtletaPartidaRepository,
      PontuacaoPartidaRepository,
    ]),
    PessoaModule,
    forwardRef(() => LigaModule),
  ],
  controllers: [PartidaController],
  providers: [PartidaService],
  exports: [TypeOrmModule, PartidaService],
})
export class PartidaModule {}
