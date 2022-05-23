import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CriaArbitroDto, ListaArbitroDto } from '../dto/arbitro.dto';
import { ArbitroService } from '../services/arbitro.service';

@Controller('pessoa/arbitro')
export class ArbitroController {
  constructor(private readonly arbitroService: ArbitroService) {}

  @Post()
  async criaArbitro(@Body() requisicao: CriaArbitroDto) {
    return this.arbitroService.criaArbitro(requisicao);
  }

  @Get()
  async listaArbitros(@Query() requisicao: ListaArbitroDto) {
    return this.arbitroService.listaArbitros(requisicao);
  }
}
