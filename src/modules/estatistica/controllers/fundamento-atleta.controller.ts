import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CriaFundamentoAtletaDto } from '../dto/fundamento-atleta.dto';
import { FundamentoAtletaService } from '../services/fundamento-atleta.service';

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

  @Delete(':id')
  async removeFundamentoAtleta(@Param('id', ParseUUIDPipe) id: string) {
    return this.fundamentoAtletaService.removeFundamento(id);
  }
}
