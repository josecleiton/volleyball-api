import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AtualizaPartidaStatusDto, CriaPartidaDto } from './dto/partida.dto';
import { PartidaService } from './partida.service';

@Controller('partida')
export class PartidaController {
  constructor(private readonly partidaService: PartidaService) {}

  @Post()
  async criaPartida(@Body() requisicao: CriaPartidaDto) {
    return this.partidaService.criaPartida(requisicao);
  }

  @Patch(':id')
  async atualizaStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requisicao: AtualizaPartidaStatusDto,
  ) {
    return this.partidaService.trocaStatus(id, requisicao.status);
  }
}
