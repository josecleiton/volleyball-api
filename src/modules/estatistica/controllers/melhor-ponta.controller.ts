import { Controller, Get, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MelhorPontaService } from '../services';

@Controller('/estatistica/ranking/ponta')
@ApiTags('melhor-ponta')
export class MelhorPontaController {
  constructor(private readonly melhorPontaService: MelhorPontaService) {}

  @Get()
  async listaMelhoresDaLiga(@Query('idLiga', ParseUUIDPipe) idLiga: string) {
    return this.melhorPontaService.listaMelhoresDaLiga(idLiga);
  }
}
