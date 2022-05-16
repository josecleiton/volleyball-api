import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { AtualizaEquipeDto, CriaEquipeDto } from './dto/equipe.dto';
import { EquipeService } from './equipe.service';

@Controller('equipe')
export class EquipeController {
  constructor(private readonly equipeService: EquipeService) {}

  @Post()
  cria(@Body() request: CriaEquipeDto) {
    return this.equipeService.criaEquipe(request);
  }

  @Get()
  lista() {
    return this.equipeService.listaEquipes();
  }

  @Get(':id')
  encontraUm(@Param('id') id: string) {
    return this.equipeService.deveEncontrarUm(id);
  }

  @Put(':id')
  atualiza(@Param('id') id: string, @Body() request: AtualizaEquipeDto) {
    return this.equipeService.atualizaEquipe(id, request);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.equipeService.remove(id);
  }
}
