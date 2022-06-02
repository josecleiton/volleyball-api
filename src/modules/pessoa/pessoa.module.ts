import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LigaModule } from '../liga/liga.module';
import { CoreModule } from '../core/core.module';
import { EquipeModule } from '../equipe/equipe.module';
import { ArbitroController } from './controllers/arbitro.controller';
import { AtletaController } from './controllers/atleta.controller';
import { DelegadoController } from './controllers/delegado.controller';
import { TecnicoController } from './controllers/tecnico.controller';
import { ArbitroRepository } from './repositories/arbitro.repository';
import { AtletaRepository } from './repositories/atleta.repository';
import { DelegadoRepository } from './repositories/delegado.repository';
import { TecnicoRepository } from './repositories/tecnico.repository';
import { ArbitroService } from './services/arbitro.service';
import { AtletaService } from './services/atleta.service';
import { DelegadoService } from './services/delegado.service';
import { TecnicoService } from './services/tecnico.service';
import { AuxiliarRepository } from './repositories/auxiliar.repository';
import { AuxiliarController } from './controllers/auxiliar.controller';
import { AuxiliarService } from './services/auxiliar.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TecnicoRepository,
      AtletaRepository,
      ArbitroRepository,
      DelegadoRepository,
      AuxiliarRepository,
    ]),
    EquipeModule,
    CoreModule,
    LigaModule,
  ],
  controllers: [
    TecnicoController,
    AtletaController,
    ArbitroController,
    DelegadoController,
    AuxiliarController,
  ],
  providers: [
    TecnicoService,
    AtletaService,
    ArbitroService,
    DelegadoService,
    AuxiliarService,
  ],
  exports: [DelegadoService],
})
export class PessoaModule {}
