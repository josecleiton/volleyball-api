import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CriaAuxiliarDto } from '../dto/auxiliar.dto';
import { AuxiliarService } from '../services/auxiliar.service';

@Controller('pessoa/auxiliar')
export class AuxiliarController {
  constructor(private readonly auxiliarService: AuxiliarService) {}

  @Post()
  criaAuxiliar(@Body() requisicao: CriaAuxiliarDto) {
    requisicao.validar();
    return this.auxiliarService.criaAuxiliar(requisicao);
  }

  @Get(':id')
  encontraAuxiliar(@Param('id', ParseUUIDPipe) id: string) {
    return this.auxiliarService.devePegarUm(id);
  }
}