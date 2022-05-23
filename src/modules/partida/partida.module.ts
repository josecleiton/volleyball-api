import { Module } from '@nestjs/common';
import { PartidaService } from './partida.service';
import { PartidaController } from './partida.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartidaRepository } from './repositories/partida.repository';
import { CoreModule } from '../core/core.module';
import { LigaModule } from '../competicao/liga.module';
import { EquipeModule } from '../equipe/equipe.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PartidaRepository]),
    CoreModule,
    LigaModule,
    EquipeModule,
  ],
  controllers: [PartidaController],
  providers: [PartidaService],
})
export class PartidaModule {}
