import { Module } from '@nestjs/common';
import { LigaService } from './services/liga.service';
import { LigaController } from './liga.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LigaRepository } from './repositories/liga.repository';
import { CoreModule } from '../core/core.module';
import { EquipeModule } from '../equipe/equipe.module';
import { ClassificacaoGeneratorService } from './tabela/classificacao-generator.service';
import { TabelaRepository } from './repositories/tabela.repository';
import { QuartaDeFinalGeneratorService } from './tabela/quarta-de-final-generator.service';
import { TabelaService } from './services/tabela.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LigaRepository, TabelaRepository]),
    CoreModule,
    EquipeModule,
  ],
  controllers: [LigaController],
  providers: [
    LigaService,
    TabelaService,
    ClassificacaoGeneratorService,
    QuartaDeFinalGeneratorService,
  ],
  exports: [TypeOrmModule, LigaService],
})
export class LigaModule {}
