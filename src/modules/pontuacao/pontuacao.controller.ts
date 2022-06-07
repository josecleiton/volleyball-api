import { Controller, Get, ParseUUIDPipe, Query } from '@nestjs/common';
import { Liga } from '../liga/entities/liga.entity';
import { PontuacaoViewRepository } from './repositories/pontuacao-view.repository';

@Controller('pontuacao')
export class PontuacaoController {
  constructor(private readonly pontuacaoRepository: PontuacaoViewRepository) {}

  @Get()
  async listaPontuacaoOrdenada(@Query('idLiga', ParseUUIDPipe) idLiga: string) {
    return this.pontuacaoRepository.listaPorLiga(
      idLiga,
      Liga.minimoDeEquipesNaLiga,
    );
  }
}
