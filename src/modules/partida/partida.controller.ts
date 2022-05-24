import { Body, Controller, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { AtualizaPartidaStatusDto } from './dto/partida.dto';
import { PartidaService } from './partida.service';

@Controller('partida')
export class PartidaController {
  constructor(private readonly partidaService: PartidaService) {}

  @Patch(':id')
  async atualizaStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requisicao: AtualizaPartidaStatusDto,
  ) {
    return this.partidaService.trocaStatus(id, requisicao.status);
  }
}
