import { IsString, IsUUID, Length } from 'class-validator';
import { Tecnico } from '../entities/tecnico.entity';
import { CriaPessoaDto, PessoaRespostaDto } from './pessoa.dto';

export class CriaTecnicoDto extends CriaPessoaDto {
  @IsString()
  @Length(11, 11)
  documentoCref!: string;

  @IsUUID()
  idEquipe!: string;

  validar() {
    super.validar();
  }
}

export class TecnicoRespostaDto extends PessoaRespostaDto {
  id: string;
  documentoCref: string;
  idEquipe: string;

  constructor(tecnico: Tecnico) {
    super(tecnico.pessoa);

    this.id = tecnico.id;
    this.documentoCref = tecnico.documentoCref;
    this.idEquipe = tecnico.idEquipe;
  }
}
