import { IsUUID } from 'class-validator';
import { Arbitro } from '../entities/arbitro.entity';
import { CriaPessoaDto } from './pessoa.dto';

export class CriaArbitroDto extends CriaPessoaDto {
  @IsUUID()
  idLiga!: string;
}

export class ListaArbitroDto {
  @IsUUID()
  idLiga!: string;
}

export class ArbitroRespostaDto {
  idLiga: string;

  constructor(arbitro: Arbitro) {
    this.idLiga = arbitro.idLiga;
  }
}
