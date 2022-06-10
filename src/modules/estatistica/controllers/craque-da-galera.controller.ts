import { Controller, Get, ParseUUIDPipe, Query } from '@nestjs/common';
import { CraqueDaGaleraService } from '../services';

@Controller('/estatistica/ranking/galera')
export class CraqueDaGaleraController {
  constructor(private readonly craqueDaGaleraService: CraqueDaGaleraService) {}

  @Get()
  async listaCraques(@Query('idLiga', ParseUUIDPipe) idLiga: string) {
    return this.craqueDaGaleraService.listaMelhoresDaLiga(idLiga);
  }
}
