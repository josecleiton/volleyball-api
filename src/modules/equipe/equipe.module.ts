import { Module } from '@nestjs/common';
import { EquipeService } from './equipe.service';
import { EquipeController } from './equipe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipeRepository } from './equipe.repository';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [TypeOrmModule.forFeature([EquipeRepository]), CoreModule],
  controllers: [EquipeController],
  providers: [EquipeService],
  exports: [EquipeService],
})
export class EquipeModule {}
