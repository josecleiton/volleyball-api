import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CriaTecnicoDto } from '../dto/tecnico.dto';
import { TecnicoService } from '../services/tecnico.service';

@Controller('pessoa/tecnico')
export class TecnicoController {
  constructor(private readonly tecnicoService: TecnicoService) {}

  @Post()
  criaTecnico(@Body() requisicao: CriaTecnicoDto) {
    return this.tecnicoService.createTecnico(requisicao);
  }

  @Get(':id')
  pegaUm(@Param('id') id: string) {
    return this.tecnicoService.devePegarTecnico(id);
  }
}
