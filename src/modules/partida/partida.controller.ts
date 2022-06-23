import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CadastrarParticipantesPartidaDto,
  ListaPartidasDto,
  RemarcarPartidaDto,
} from './dto/partida.dto';
import { PartidaService } from './services/partida.service';

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
}
