import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartidaRepository } from '../partida/repositories';
import { PontuacaoController } from './pontuacao.controller';
import { PontuacaoService } from './pontuacao.service';
import { PontuacaoViewRepository } from './repositories/pontuacao-view.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PontuacaoViewRepository, PartidaRepository])],
  controllers: [PontuacaoController],
  providers: [PontuacaoService],
  exports: [PontuacaoService, TypeOrmModule],
})
export class PontuacaoModule {}
