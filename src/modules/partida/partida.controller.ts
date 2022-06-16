import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  CadastrarParticipantesPartidaDto,
  ListaPartidasDto,
} from './dto/partida.dto';
import { PartidaService } from './services/partida.service';

@Controller('partida')
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

  @Post(':id/cadastra-participantes')
  async iniciaPartida(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requisicao: CadastrarParticipantesPartidaDto,
  ) {
    return this.partidaService.cadastrarParticipantes(id, requisicao);
  }
}
