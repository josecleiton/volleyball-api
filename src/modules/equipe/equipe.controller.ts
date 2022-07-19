import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  ParseUUIDPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CriaEquipeDto, ListaEquipesDto, AtualizaEquipeDto } from './dto';
import { EquipeService } from './equipe.service';

@Controller('equipe')
@ApiTags('equipe')
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
