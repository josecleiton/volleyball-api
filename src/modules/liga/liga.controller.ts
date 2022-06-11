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
import {
  InicializaFinalDto,
  InicializaQuartaDeFinalDto,
  InicializaSemifinalDto,
} from './dto/tabela.dto';

@Controller('liga')
export class LigaController {
  constructor(private readonly ligaService: LigaService) {}

  @Post()
  async criaLiga(@Body() requisicao: CriaLigaDto) {
    return this.ligaService.criaLiga(requisicao);
  }

  @Post(':id/inicializa')
  async inicializaLiga(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requisicao: InicializaLigaDto,
  ) {
    requisicao.valida();

    return this.ligaService.iniciaLiga(id, requisicao);
  }

  @Post(':id/inicializa-quartas')
  async agendaQuartas(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requisicao: InicializaQuartaDeFinalDto,
  ) {
    requisicao.valida();

    return this.ligaService.inicializaQuartas(id, requisicao);
  }

  @Post(':id/inicializa-semis')
  async inicializaSemis(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requisicao: InicializaSemifinalDto,
  ) {
    requisicao.valida();

    return this.ligaService.inicializaSemis(id, requisicao);
  }

  @Post(':id/inicializa-final')
  async inicializaFinal(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requisicao: InicializaFinalDto,
  ) {
    requisicao.valida();

    return this.ligaService.inicializaFinal(id, requisicao);
  }

  @Get()
  async listaLigas() {
    return this.ligaService.lista();
  }

  @Get(':id')
  async encontraLiga(@Param('id', ParseUUIDPipe) id: string) {
    return this.ligaService.deveEncontrarUm(id);
  }

  @Delete(':id')
  async removeLiga(@Param('id', ParseUUIDPipe) id: string) {
    return this.ligaService.remove(id);
  }
}
