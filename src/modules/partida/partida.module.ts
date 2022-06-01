import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PartidaService } from './partida.service';
import { PartidaController } from './partida.controller';
import { PartidaRepository } from './repositories/partida.repository';
import { ArbitroPartidaRepository } from './repositories/arbitro-partida.repository';
import { AtletaPartidaRepository } from './repositories/atleta-partida.repository';
import { PontuacaoPartidaRepository } from './repositories/pontuacao-partida.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PartidaRepository,
      ArbitroPartidaRepository,
      AtletaPartidaRepository,
      PontuacaoPartidaRepository,
    ]),
  ],
  controllers: [PartidaController],
  providers: [PartidaService],
})
export class PartidaModule {}
