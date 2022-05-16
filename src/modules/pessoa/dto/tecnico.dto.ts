import { IsString, IsUUID, Length } from 'class-validator';
import { Tecnico } from '../entities/tecnico.entity';
import { CriaPessoa, PessoaResposta } from './pessoa.dto';

export class CriaTecnico extends CriaPessoa {
  @IsString()
  @Length(11, 11)
  documentoCref!: string;

  @IsUUID()
  idEquipe!: string;
}

export class TecnicoResposta extends PessoaResposta {
  documentoCref: string;
  idEquipe: string;

  constructor(tecnico: Tecnico) {
    super(tecnico.pessoa);

    this.documentoCref = tecnico.documentoCref;
    this.idEquipe = tecnico.idEquipe;
  }
}
