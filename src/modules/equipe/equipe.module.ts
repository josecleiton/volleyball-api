import { forwardRef, Module } from '@nestjs/common';
import { EquipeService } from './equipe.service';
import { EquipeController } from './equipe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipeRepository } from './equipe.repository';
import { CoreModule } from '../core/core.module';
import { LigaModule } from '../liga/liga.module';
import { GinasioModule } from '../ginasio/ginasio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EquipeRepository]),
    CoreModule,
    forwardRef(() => LigaModule),
    GinasioModule,
  ],
  controllers: [EquipeController],
  providers: [EquipeService],
  exports: [EquipeService],
})
export class EquipeModule {}
