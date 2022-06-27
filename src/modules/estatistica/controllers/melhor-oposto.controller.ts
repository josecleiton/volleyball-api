import { Controller, Get, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MelhorOpostoService } from '../services';

@Controller('/estatistica/ranking/oposto')
@ApiTags('estatistica')
export class MelhorOpostoController {
  constructor(private readonly melhorPontaService: MelhorOpostoService) {}

  @Get()
  async listaMelhoresDaLiga(@Query('idLiga', ParseUUIDPipe) idLiga: string) {
    return this.melhorPontaService.listaMelhoresDaLiga(idLiga);
  }
}
