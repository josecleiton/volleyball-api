import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CriaTecnicoDto } from '../dto';
import { TecnicoService } from '../services';

@Controller('pessoa/tecnico')
@ApiTags('tecnico')
export class TecnicoController {
  constructor(private readonly tecnicoService: TecnicoService) {}

  @Post()
  criaTecnico(@Body() requisicao: CriaTecnicoDto) {
    return this.tecnicoService.createTecnico(requisicao);
  }

  @Get(':id')
  encontraUm(@Param('id', ParseUUIDPipe) id: string) {
    return this.tecnicoService.deveEncontrarUm(id);
  }
}
