import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CadastrarParticipantesPartidaDto } from './dto/partida.dto';
import { PartidaService } from './partida.service';

@Controller('partida')
export class PartidaController {
  constructor(private readonly partidaService: PartidaService) {}

  @Get()
  async listaPartidas(@Query('idLiga', ParseUUIDPipe) idLiga: string) {
    return this.partidaService.listaPartidas(idLiga);
  }

  @Post(':id/cadastra-participantes')
  async iniciaPartida(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requisicao: CadastrarParticipantesPartidaDto,
  ) {
    return this.partidaService.cadastrarParticipantes(id, requisicao);
  }
}
