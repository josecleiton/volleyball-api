import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { LigaService } from './services/liga.service';
import { CriaLigaDto, InicializaLigaDto } from './dto/liga.dto';
import {
  InicializaFinalDto,
  InicializaQuartaDeFinalDto,
  InicializaSemifinalDto,
} from './dto/tabela.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('liga')
@ApiTags('liga')
export class LigaController {
  constructor(private readonly ligaService: LigaService) {}

  @Post()
  async criaLiga(@Body() requisicao: CriaLigaDto) {
    return this.ligaService.criaLiga(requisicao);
  }

  @Post(':id/inicializa')
  @HttpCode(200)
  async inicializaLiga(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requisicao: InicializaLigaDto,
  ) {
    return this.ligaService.iniciaLiga(id, requisicao);
  }

  @Post(':id/inicializa-quartas')
  @HttpCode(200)
  async agendaQuartas(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requisicao: InicializaQuartaDeFinalDto,
  ) {
    return this.ligaService.inicializaQuartas(id, requisicao);
  }

  @Post(':id/inicializa-semis')
  @HttpCode(200)
  async inicializaSemis(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requisicao: InicializaSemifinalDto,
  ) {
    return this.ligaService.inicializaSemis(id, requisicao);
  }

  @Post(':id/inicializa-final')
  @HttpCode(200)
  async inicializaFinal(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requisicao: InicializaFinalDto,
  ) {
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
