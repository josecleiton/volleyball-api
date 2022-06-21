import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CriaTecnicoDto } from '../dto/tecnico.dto';
import { TecnicoService } from '../services/tecnico.service';

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
