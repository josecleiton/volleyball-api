import { Controller, Get, ParseUUIDPipe, Query } from '@nestjs/common';
import { PontuacaoService } from './pontuacao.service';

@Controller('pontuacao')
export class PontuacaoController {
  constructor(private readonly pontuacaoService: PontuacaoService) {}

  @Get()
  async listaPontuacaoOrdenada(@Query('idLiga', ParseUUIDPipe) idLiga: string) {
    return this.pontuacaoService.listaPontuacoesOrdenadas(idLiga);
  }
}
