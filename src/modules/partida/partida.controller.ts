import {
  Controller,
  Get,
  Query,
  Param,
  ParseUUIDPipe,
  Patch,
  Body,
  Post,
  HttpCode,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ListaPartidasDto,
  RemarcarPartidaDto,
  CadastrarParticipantesPartidaDto,
  CadastrarResultadoPartidaDto,
} from './dto';
import { PartidaService } from './services';

@Controller('partida')
@ApiTags('partida')
export class PartidaController {
  constructor(private readonly partidaService: PartidaService) {}

  @Get()
  async listaPartidas(@Query() requisicao: ListaPartidasDto) {
    return this.partidaService.listaPartidasOrdenadas(requisicao);
  }

  @Get(':id')
  async encontraPartida(@Param('id', ParseUUIDPipe) id: string) {
    return this.partidaService.encontraPartida(id);
  }

  @Patch(':id/remarcar')
  async remarcarPartida(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requisicao: RemarcarPartidaDto,
  ) {
    return this.partidaService.remarcarPartida(id, requisicao);
  }

  @Post(':id/cadastra-participantes')
  async iniciaPartida(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requisicao: CadastrarParticipantesPartidaDto,
  ) {
    return this.partidaService.cadastrarParticipantes(id, requisicao);
  }

  @Post(':id/cadastra-resultado')
  @HttpCode(200)
  async cadastraResultado(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requisicao: CadastrarResultadoPartidaDto,
  ) {
    return this.partidaService.cadastrarResultado(id, requisicao);
  }
}
