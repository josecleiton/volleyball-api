import { Controller, Get, ParseUUIDPipe, Query } from '@nestjs/common';
import { MelhorCentralService } from '../services';

@Controller('/estatistica/ranking/central')
export class MelhorCentralController {
  constructor(private readonly melhorCentralService: MelhorCentralService) {}

  @Get()
  async listaMelhoresDaLiga(@Query('idLiga', ParseUUIDPipe) idLiga: string) {
    return this.melhorCentralService.listaMelhoresDaLiga(idLiga);
  }
}
