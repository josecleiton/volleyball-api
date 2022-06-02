import { Module } from '@nestjs/common';
import { LigaService } from './liga.service';
import { LigaController } from './liga.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LigaRepository } from './repositories/liga.repository';
import { CoreModule } from '../core/core.module';
import { EquipeModule } from '../equipe/equipe.module';
import { ClassificacaoGeneratorService } from './tabela/classificacao-generator.service';
import { TabelaRepository } from './repositories/tabela.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([LigaRepository, TabelaRepository]),
    CoreModule,
    EquipeModule,
  ],
  controllers: [LigaController],
  providers: [LigaService, ClassificacaoGeneratorService],
  exports: [TypeOrmModule, LigaService],
})
export class LigaModule {}
