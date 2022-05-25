import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  AtualizaAtletaDto,
  CriaAtletaDto,
  ListaAtletaDto,
} from '../dto/atleta.dto';
import { AtletaService } from '../services/atleta.service';

@Controller('pessoa/atleta')
export class AtletaController {
  constructor(private readonly atletaService: AtletaService) {}

  @Post()
  async criaAtleta(@Body() requisicao: CriaAtletaDto) {
    requisicao.validar();
    return this.atletaService.criaAtleta(requisicao);
  }

  @Get(':id')
  async pegaUm(@Param('id', ParseUUIDPipe) id: string) {
    return this.atletaService.deveEncontrarUm(id);
  }

  @Get()
  async listaAtletas(@Query() requisicao: ListaAtletaDto) {
    return this.atletaService.listaAtletas(requisicao);
  }

  @Patch(':id')
  async atualizaAtleta(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requisicao: AtualizaAtletaDto,
  ) {
    requisicao.validar?.();
    return this.atletaService.atualizaAtleta(id, requisicao);
  }

  @Delete(':id')
  async removeAtleta(@Param('id', ParseUUIDPipe) id: string) {
    return this.atletaService.removerAtleta(id);
  }
}
