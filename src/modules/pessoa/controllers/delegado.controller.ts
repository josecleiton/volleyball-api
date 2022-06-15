import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CriaArbitroDto, ListaArbitroDto } from '../dto/arbitro.dto';
import { DelegadoService } from '../services/delegado.service';

@Controller('pessoa/delegado')
export class DelegadoController {
  constructor(private readonly delegadoService: DelegadoService) {}

  @Post()
  async criaDelegado(@Body() requisicao: CriaArbitroDto) {
    return this.delegadoService.criaDelegado(requisicao);
  }

  @Get()
  async listaDelegados(@Query() requisicao: ListaArbitroDto) {
    return this.delegadoService.listaDelegados(requisicao);
  }

  @Get(':id')
  async encontraDelegado(@Param('id', ParseUUIDPipe) id: string) {
    return this.delegadoService.deveEncontrarUm(id);
  }
}
