import { IsUUID } from 'class-validator';
import { Arbitro } from '../entities/arbitro.entity';
import { CriaPessoaDto, PessoaRespostaDto } from './pessoa.dto';

export class CriaArbitroDto extends CriaPessoaDto {
  @IsUUID()
  idLiga!: string;
}

export class ListaArbitroDto {
  @IsUUID()
  idLiga!: string;
}

export class ArbitroRespostaDto extends PessoaRespostaDto {
  id: string;
  idLiga: string;

  constructor(arbitro: Arbitro) {
    super(arbitro.pessoa);

    this.id = arbitro.id;
    this.idLiga = arbitro.idLiga;
  }
}
