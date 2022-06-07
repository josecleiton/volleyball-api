import { Module } from '@nestjs/common';
import { LigaService } from './services/liga.service';
import { LigaController } from './liga.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LigaRepository } from './repositories/liga.repository';
import { CoreModule } from '../core/core.module';
import { EquipeModule } from '../equipe/equipe.module';
import { PontuacaoEquipeRepository } from './repositories/pontuacao_equipe.repository';
import { PontuacaoEquipeService } from './services/pontuacao-equipe.service';
import { PartidaModule } from '../partida/partida.module';
import {
  ClassificacaoGeneratorService,
  FinalGeneratorService,
  QuartaDeFinalGeneratorService,
  SemifinalGeneratorService,
} from './tabela';

@Module({
  imports: [
    TypeOrmModule.forFeature([LigaRepository, PontuacaoEquipeRepository]),
    CoreModule,
    EquipeModule,
    PartidaModule,
  ],
  controllers: [LigaController],
  providers: [
    LigaService,
    PontuacaoEquipeService,
    ClassificacaoGeneratorService,
    QuartaDeFinalGeneratorService,
    SemifinalGeneratorService,
    FinalGeneratorService,
  ],
  exports: [TypeOrmModule, LigaService],
})
export class LigaModule {}
