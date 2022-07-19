import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CriaArbitroDto, ListaArbitroDto } from '../dto';
import { DelegadoService } from '../services';

@Controller('pessoa/delegado')
@ApiTags('delegado')
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
