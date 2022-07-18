import { Module } from '@nestjs/common';
import { LigaService } from './services/liga.service';
import { LigaController } from './liga.controller';
import { LigaRepository } from './repositories/liga.repository';
import { CoreModule } from '../core/core.module';
import { EquipeModule } from '../equipe/equipe.module';
import { PartidaModule } from '../partida/partida.module';
import {
  ClassificacaoGeneratorService,
  FinalGeneratorService,
  QuartaDeFinalGeneratorService,
  SemifinalGeneratorService,
} from './tabela';
import { PontuacaoModule } from '../pontuacao/pontuacao.module';
import { TypeOrmExModule } from '../core/typeorm-ex/typeorm-ex.module';

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
