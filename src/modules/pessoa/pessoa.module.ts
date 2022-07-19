import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmExModule, CoreModule } from '../core';
import { EquipeModule } from '../equipe';
import { LigaModule } from '../liga';
import {
  TecnicoController,
  AtletaController,
  ArbitroController,
  DelegadoController,
  AuxiliarController,
} from './controllers';
import {
  TecnicoRepository,
  AtletaRepository,
  ArbitroRepository,
  DelegadoRepository,
  AuxiliarRepository,
} from './repositories';
import {
  TecnicoService,
  AtletaService,
  ArbitroService,
  DelegadoService,
  AuxiliarService,
} from './services';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      TecnicoRepository,
      AtletaRepository,
      ArbitroRepository,
      DelegadoRepository,
      AuxiliarRepository,
    ]),
    EquipeModule,
    CoreModule,
    forwardRef(() => LigaModule),
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
  exports: [DelegadoService, ArbitroService, AtletaService],
})
export class PessoaModule {}
