import { forwardRef, Module } from '@nestjs/common';
import { EquipeService } from './equipe.service';
import { EquipeController } from './equipe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipeRepository } from './equipe.repository';
import { CoreModule } from '../core/core.module';
import { LigaModule } from '../competicao/liga.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EquipeRepository]),
    CoreModule,
    forwardRef(() => LigaModule),
  ],
  controllers: [EquipeController],
  providers: [EquipeService],
  exports: [EquipeService],
})
export class EquipeModule {}
