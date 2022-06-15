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
  id: string;
  idLiga: string;

  constructor(delegado: Delegado) {
    super(delegado.pessoa);

    this.id = delegado.id;
    this.idLiga = delegado.idLiga;
  }
}
