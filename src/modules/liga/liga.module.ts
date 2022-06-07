import { Module } from '@nestjs/common';
import { LigaService } from './services/liga.service';
import { LigaController } from './liga.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LigaRepository } from './repositories/liga.repository';
import { CoreModule } from '../core/core.module';
import { EquipeModule } from '../equipe/equipe.module';
import { ClassificacaoGeneratorService } from './tabela/classificacao-generator.service';
import { PontuacaoEquipeRepository } from './repositories/pontuacao_equipe.repository';
import { QuartaDeFinalGeneratorService } from './tabela/quarta-de-final-generator.service';
import { PontuacaoEquipeService } from './services/pontuacao-equipe.service';
import { PartidaModule } from '../partida/partida.module';
import { SemifinalGeneratorService } from './tabela/semifinal-generator.service';

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
  ],
  exports: [TypeOrmModule, LigaService],
})
export class LigaModule {}
