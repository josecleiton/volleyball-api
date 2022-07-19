import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Delete,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CriaGinasioDto, ListaGinasiosDto } from './dto';
import { GinasioService } from './ginasio.service';

@Controller('ginasio')
@ApiTags('ginasio')
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

  @Delete(':id')
  async removeGinasio(@Param('id', ParseUUIDPipe) id: string) {
    return this.ginasioService.removeGinasio(id);
  }
}
