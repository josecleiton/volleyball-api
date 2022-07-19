import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CriaAtletaDto, ListaAtletaDto, AtualizaAtletaDto } from '../dto';
import { AtletaService } from '../services';

@Controller('pessoa/atleta')
@ApiTags('atleta')
export class AtletaController {
  constructor(private readonly atletaService: AtletaService) {}

  @Post()
  async criaAtleta(@Body() requisicao: CriaAtletaDto) {
    return this.atletaService.criaAtleta(requisicao);
  }

  @Get(':id')
  async encontraUm(@Param('id', ParseUUIDPipe) id: string) {
    return this.atletaService.deveEncontrar(id);
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
    return this.atletaService.atualizaAtleta(id, requisicao);
  }

  @Delete(':id')
  async removeAtleta(@Param('id', ParseUUIDPipe) id: string) {
    return this.atletaService.removerAtleta(id);
  }
}
