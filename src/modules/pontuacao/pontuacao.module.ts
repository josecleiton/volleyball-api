import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartidaModule } from '../partida/partida.module';
import { AplicaRegraDesempateService } from './aplica-regra-desempate.service';
import { PontuacaoController } from './pontuacao.controller';
import { PontuacaoService } from './pontuacao.service';
import { PontuacaoViewRepository } from './repositories/pontuacao-view.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PontuacaoViewRepository]),
    forwardRef(() => PartidaModule),
  ],
  controllers: [PontuacaoController],
  providers: [PontuacaoService, AplicaRegraDesempateService],
  exports: [PontuacaoService, TypeOrmModule],
})
export class PontuacaoModule {}
