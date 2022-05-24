import { IsUUID } from 'class-validator';
import { Delegado } from '../entities/delegado.entity';
import { CriaPessoaDto, PessoaRespostaDto } from './pessoa.dto';

export class ListaDelegadoDto {
  @IsUUID()
  idLiga!: string;
}

export class CriaDelegadoDto extends CriaPessoaDto {
  @IsUUID()
  idLiga!: string;
}

export class DelegadoRespostaDto extends PessoaRespostaDto {
  idLiga: string;

  constructor(delegado: Delegado) {
    super(delegado.pessoa);

    this.idLiga = delegado.idLiga;
  }
}
