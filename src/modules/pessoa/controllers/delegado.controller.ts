import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DelegadoService } from '../services/delegado.service';

@Controller('pessoa/delegado')
export class DelegadoController {
  constructor(private readonly delegadoService: DelegadoService) {}

  @Post()
  async criaArbitro(@Body() requisicao: CriaArbitroDto) {
    return this.delegadoService.criaDelegado(requisicao);
  }

  @Get()
  async listaArbitros(@Query() requisicao: ListaArbitroDto) {
    return this.delegadoService.listaDelegados(requisicao);
  }
}
