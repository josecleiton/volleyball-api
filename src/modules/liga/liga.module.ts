import { Module } from '@nestjs/common';
import { TypeOrmExModule, CoreModule } from '../core';
import { EquipeModule } from '../equipe';
import { PartidaModule } from '../partida';
import { PontuacaoModule } from '../pontuacao';
import { LigaController } from './liga.controller';
import { LigaRepository } from './repositories';
import { LigaService } from './services';
import {
  ClassificacaoGeneratorService,
  QuartaDeFinalGeneratorService,
  SemifinalGeneratorService,
  FinalGeneratorService,
} from './tabela';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([LigaRepository]),
    CoreModule,
    EquipeModule,
    PartidaModule,
    PontuacaoModule,
  ],
  controllers: [LigaController],
  providers: [
    LigaService,
    ClassificacaoGeneratorService,
    QuartaDeFinalGeneratorService,
    SemifinalGeneratorService,
    FinalGeneratorService,
  ],
  exports: [LigaService],
})
export class LigaModule {}
