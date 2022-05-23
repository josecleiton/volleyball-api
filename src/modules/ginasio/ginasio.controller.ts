import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CriaGinasioDto, ListaGinasiosDto } from './dto/ginasio.dto';
import { GinasioService } from './ginasio.service';

@Controller('ginasio')
export class GinasioController {
  constructor(private readonly ginasioService: GinasioService) {}

  @Post()
  async criaGinasio(@Body() requisicao: CriaGinasioDto) {
    return this.ginasioService.criaGinasio(requisicao);
  }

  @Get()
  async listaGinasios(@Query() requisicao: ListaGinasiosDto) {
    return this.ginasioService.listaGinasio(requisicao);
  }
}
