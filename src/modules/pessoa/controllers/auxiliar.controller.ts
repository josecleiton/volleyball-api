import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CriaAuxiliarDto, ListaAuxiliarDto } from '../dto';
import { AuxiliarService } from '../services';

@Controller('pessoa/auxiliar')
@ApiTags('auxiliar')
export class AuxiliarController {
  constructor(private readonly auxiliarService: AuxiliarService) {}

  @Post()
  async criaAuxiliar(@Body() requisicao: CriaAuxiliarDto) {
    return this.auxiliarService.criaAuxiliar(requisicao);
  }

  @Get()
  async listaAuxiliares(@Query() requisicao: ListaAuxiliarDto) {
    return this.auxiliarService.listaAuxiliares(requisicao);
  }

  @Get(':id')
  async encontraAuxiliar(@Param('id', ParseUUIDPipe) id: string) {
    return this.auxiliarService.devePegarUm(id);
  }
}
