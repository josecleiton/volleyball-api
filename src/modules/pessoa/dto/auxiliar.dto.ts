import { IsEnum, IsString, IsUUID, Length } from 'class-validator';
import { Auxiliar } from '../entities/auxiliar.entity';
import { TipoAuxiliar } from '../enums';
import { CriaPessoaDto, PessoaRespostaDto } from './pessoa.dto';

export class CriaAuxiliarDto extends CriaPessoaDto {
  @IsString()
  @Length(11, 11)
  documentoCref!: string;

  @IsUUID()
  idEquipe!: string;

  @IsEnum(TipoAuxiliar)
  tipoAuxiliar!: TipoAuxiliar;
}

export class AuxiliarRespostaDto extends PessoaRespostaDto {
  id: string;
  idEquipe: string;
  documentoCref: string;
  tipoAuxiliar: TipoAuxiliar;

  constructor(auxiliar: Auxiliar) {
    super(auxiliar.pessoa);

    this.id = auxiliar.id;
    this.idEquipe = auxiliar.idEquipe;
    this.documentoCref = auxiliar.documentoCref;
    this.tipoAuxiliar = auxiliar.tipoAuxiliar;
  }
}