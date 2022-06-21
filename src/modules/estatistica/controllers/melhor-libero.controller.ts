import { Controller, Get, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MelhorLiberoService } from '../services/melhor-libero.service';

@Controller('/estatistica/ranking/libero')
@ApiTags('melhor-libero')
export class MelhorLiberoController {
  constructor(private readonly melhorLiberoService: MelhorLiberoService) {}

  @Get()
  async listaMelhoresDaLiga(@Query('idLiga', ParseUUIDPipe) idLiga: string) {
    return this.melhorLiberoService.listaMelhoresDaLiga(idLiga);
  }
}
