import { OmitType, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsPositive, IsUUID, Max } from 'class-validator';
import { Atleta } from '../entities/atleta.entity';
import { Posicao } from '../enums';
import { CriaPessoaDto, PessoaRespostaDto } from './pessoa.dto';

export class CriaAtletaDto extends CriaPessoaDto {
  @IsPositive()
  @Max(100)
  numero!: number;

  @IsEnum(Posicao)
  posicao!: Posicao;

  @IsUUID()
  idEquipe!: string;

  validar() {
    super.validar();
  }
}

export class AtualizaAtletaDto extends PartialType(
  OmitType(CriaAtletaDto, [
    'idEquipe',
    'documento',
    'documentoCbv',
    'paraPessoa',
    'genero',
  ]),
) {}

export class ListaAtletaDto {
  @IsNotEmpty()
  @IsUUID()
  idEquipe!: string;
}

export class AtletaRespostaDto extends PessoaRespostaDto {
  id: string;
  numero: number;
  idEquipe: string;
  posicao: Posicao;

  constructor(atleta: Atleta) {
    super(atleta.pessoa);

    this.id = atleta.id;
    this.numero = atleta.numero;
    this.idEquipe = atleta.idEquipe;
    this.posicao = atleta.posicao;
  }
}
