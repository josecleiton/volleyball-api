import { Controller, Get, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MelhorCentralService } from '../services';

@Controller('/estatistica/ranking/central')
@ApiTags('estatistica')
export class MelhorCentralController {
  constructor(private readonly melhorCentralService: MelhorCentralService) {}

  @Get()
  async listaMelhoresDaLiga(@Query('idLiga', ParseUUIDPipe) idLiga: string) {
    return this.melhorCentralService.listaMelhoresDaLiga(idLiga);
  }
}
