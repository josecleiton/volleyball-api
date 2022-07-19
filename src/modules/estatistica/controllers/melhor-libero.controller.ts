import { Controller, Get, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MelhorLiberoService } from '../services';

@Controller('/estatistica/ranking/libero')
@ApiTags('estatistica')
export class MelhorLiberoController {
  constructor(private readonly melhorLiberoService: MelhorLiberoService) {}

  @Get()
  async listaMelhoresDaLiga(@Query('idLiga', ParseUUIDPipe) idLiga: string) {
    return this.melhorLiberoService.listaMelhoresDaLiga(idLiga);
  }
}
