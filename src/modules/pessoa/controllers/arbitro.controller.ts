import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CriaArbitroDto, ListaArbitroDto } from '../dto';
import { ArbitroService } from '../services';

@Controller('pessoa/arbitro')
@ApiTags('arbitro')
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
