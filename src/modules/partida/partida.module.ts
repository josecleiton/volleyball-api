import { Module } from '@nestjs/common';
import { PartidaService } from './partida.service';
import { PartidaController } from './partida.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartidaRepository } from './repositories/partida.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PartidaRepository])],
  controllers: [PartidaController],
  providers: [PartidaService],
})
export class PartidaModule {}
