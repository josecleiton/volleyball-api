import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CriaAuxiliarDto, ListaAuxiliarDto } from '../dto/auxiliar.dto';
import { AuxiliarService } from '../services/auxiliar.service';

@Controller('pessoa/auxiliar')
export class AuxiliarController {
  constructor(private readonly auxiliarService: AuxiliarService) {}

  @Post()
  async criaAuxiliar(@Body() requisicao: CriaAuxiliarDto) {
    requisicao.validar();
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
