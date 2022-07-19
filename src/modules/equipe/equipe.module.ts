import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmExModule, CoreModule } from '../core';
import { GinasioModule } from '../ginasio';
import { LigaModule } from '../liga';
import { EquipeController } from './equipe.controller';
import { EquipeRepository } from './equipe.repository';
import { EquipeService } from './equipe.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([EquipeRepository]),
    CoreModule,
    forwardRef(() => LigaModule),
    GinasioModule,
  ],
  controllers: [EquipeController],
  providers: [EquipeService],
  exports: [EquipeService],
})
export class EquipeModule {}
