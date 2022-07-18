import { forwardRef, Module } from '@nestjs/common';
import { EquipeService } from './equipe.service';
import { EquipeController } from './equipe.controller';
import { EquipeRepository } from './equipe.repository';
import { CoreModule } from '../core/core.module';
import { GinasioModule } from '../ginasio/ginasio.module';
import { LigaModule } from '../liga/liga.module';
import { TypeOrmExModule } from '../core/typeorm-ex/typeorm-ex.module';

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
