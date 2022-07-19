import { Controller, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IniciarVotoDto, ConfirmarVotoDto } from '../dto';
import { VotoDaGaleraService } from '../services';

@Controller('/estatistica/ranking/galera/voto')
@ApiTags('estatistica')
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
