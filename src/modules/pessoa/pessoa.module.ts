import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LigaModule } from '../competicao/liga.module';
import { CoreModule } from '../core/core.module';
import { EquipeModule } from '../equipe/equipe.module';
import { AtletaController } from './controllers/atleta.controller';
import { TecnicoController } from './controllers/tecnico.controller';
import { AtletaRepository } from './repositories/atleta.repository';
import { TecnicoRepository } from './repositories/tecnico.repository';
import { AtletaService } from './services/atleta.service';
import { TecnicoService } from './services/tecnico.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TecnicoRepository, AtletaRepository]),
    EquipeModule,
    CoreModule,
    LigaModule,
  ],
  controllers: [TecnicoController, AtletaController],
  providers: [TecnicoService, AtletaService],
})
export class PessoaModule {}
