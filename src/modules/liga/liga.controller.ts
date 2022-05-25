import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { LigaService } from './liga.service';
import { CriaLigaDto } from './dto/liga.dto';

@Controller('liga')
export class LigaController {
  constructor(private readonly ligaService: LigaService) {}

  @Post()
  criaLiga(@Body() requisicao: CriaLigaDto) {
    return this.ligaService.criaLiga(requisicao);
  }

  @Post(':id/inicializa')
  inicializaLiga(@Param('id', ParseUUIDPipe) id: string) {
    return this.ligaService.iniciaLiga(id);
  }

  @Get()
  listaLigas() {
    return this.ligaService.lista();
  }

  @Get(':id')
  pegaLiga(@Param('id', ParseUUIDPipe) id: string) {
    return this.ligaService.deveEncontrarUm(id);
  }

  @Delete(':id')
  removeLiga(@Param('id', ParseUUIDPipe) id: string) {
    return this.ligaService.remove(id);
  }
}
