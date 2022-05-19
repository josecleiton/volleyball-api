import { Module } from '@nestjs/common';
import { LigaService } from './liga.service';
import { LigaController } from './liga.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LigaRepository } from './liga.repository';
import { CoreModule } from '../core/core.module';
import { EquipeModule } from '../equipe/equipe.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LigaRepository]),
    CoreModule,
    EquipeModule,
  ],
  controllers: [LigaController],
  providers: [LigaService],
})
export class LigaModule {}
