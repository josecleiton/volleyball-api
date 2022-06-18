import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ConfirmarVotoDto, IniciarVotoDto } from '../dto/voto-da-galera.dto';
import { VotoDaGaleraService } from '../services';

@Controller('/estatistica/ranking/galera/voto')
export class VotoDaGaleraController {
  constructor(private readonly votoDaGaleraService: VotoDaGaleraService) {}

  @Post()
  async iniciaVoto(@Body() requisicao: IniciarVotoDto) {
    return this.votoDaGaleraService.iniciarVoto(requisicao);
  }

  @Post(':id/confirmar')
  async confirmaVoto(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requisicao: ConfirmarVotoDto,
  ) {
    return this.votoDaGaleraService.confirmaVoto(id, requisicao);
  }
}
