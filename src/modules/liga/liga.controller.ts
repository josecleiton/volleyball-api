import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { LigaService } from './services/liga.service';
import { CriaLigaDto, InicializaLigaDto } from './dto/liga.dto';
import { InicializaQuartaDeFinalDto } from './dto/pontuacao_equipe.dto';

@Controller('liga')
export class LigaController {
  constructor(private readonly ligaService: LigaService) {}

  @Post()
  criaLiga(@Body() requisicao: CriaLigaDto) {
    return this.ligaService.criaLiga(requisicao);
  }

  @Post(':id/inicializa')
  inicializaLiga(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requisicao: InicializaLigaDto,
  ) {
    requisicao.valida();

    return this.ligaService.iniciaLiga(id, requisicao);
  }

  @Post(':id/inicializa-quartas')
  agendaQuartas(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requisicao: InicializaQuartaDeFinalDto,
  ) {
    requisicao.valida();

    return this.ligaService.inicializaQuartas(id, requisicao);
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
