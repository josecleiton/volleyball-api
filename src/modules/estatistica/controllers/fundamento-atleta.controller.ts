import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  ParseUUIDPipe,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { CriaFundamentoAtletaDto, ListaFundamentoNaLigaDto } from '../dto';
import { FundamentoAtletaService } from '../services';

@Controller('estatistica/atleta')
@ApiTags('estatistica')
export class FundamentoAtletaController {
  constructor(
    private readonly fundamentoAtletaService: FundamentoAtletaService,
  ) {}

  @Post()
  async criaFundamentoAtleta(@Body() requisicao: CriaFundamentoAtletaDto) {
    return this.fundamentoAtletaService.criaFundamento(requisicao);
  }

  @Get('geral')
  @Throttle(3, 60)
  @SkipThrottle(false)
  async listaFundamentosNaLiga(@Query() requisicao: ListaFundamentoNaLigaDto) {
    return this.fundamentoAtletaService.listaFundamentoNaLiga(requisicao);
  }

  @Get('geral/:id')
  async listaFundamentosAtleta(@Param('id', ParseUUIDPipe) id: string) {
    return this.fundamentoAtletaService.listaFundamentoDeAtleta(id);
  }

  @Delete(':id')
  async removeFundamentoAtleta(@Param('id', ParseUUIDPipe) id: string) {
    return this.fundamentoAtletaService.removeFundamento(id);
  }
}
