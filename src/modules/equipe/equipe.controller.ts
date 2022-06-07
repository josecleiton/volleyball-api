import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import {
  AtualizaEquipeDto,
  CriaEquipeDto,
  ListaEquipesDto,
} from './dto/equipe.dto';
import { EquipeService } from './equipe.service';

@Controller('equipe')
export class EquipeController {
  constructor(private readonly equipeService: EquipeService) {}

  @Post()
  cria(@Body() request: CriaEquipeDto) {
    return this.equipeService.criaEquipe(request);
  }

  @Get()
  lista(@Query() requisicao: ListaEquipesDto) {
    return this.equipeService.listaEquipes(requisicao);
  }

  @Get(':id')
  encontraUm(@Param('id', ParseUUIDPipe) id: string) {
    return this.equipeService.deveEncontrarUm(id);
  }

  @Patch(':id')
  atualiza(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() request: AtualizaEquipeDto,
  ) {
    return this.equipeService.atualizaEquipe(id, request);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.equipeService.remove(id);
  }
}
