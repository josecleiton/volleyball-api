import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsUUID,
  Max,
} from 'class-validator';
import { EquipeRespostaDto } from 'src/modules/equipe/dto/equipe.dto';
import { Atleta } from '../entities/atleta.entity';
import {
  AtualizaPessoaDto,
  CriaPessoaDto,
  PessoaRespostaDto,
} from './pessoa.dto';

export class CriaAtletaDto extends CriaPessoaDto {
  @IsPositive()
  @Max(100)
  numero!: number;

  @IsUUID()
  idEquipe!: string;
}

export class AtualizaAtletaDto extends AtualizaPessoaDto {
  @IsOptional()
  @IsPositive()
  @Max(100)
  numero?: number;
}

export class ListaAtletaDto {
  @IsNotEmpty()
  @IsUUID()
  idEquipe!: string;

  @IsArray()
  @IsOptional()
  @IsUUID(4, { each: true })
  ids?: string[];
}

export class DeveListarAtletasDto extends ListaAtletaDto {
  ids!: string[];
}

export interface IValidaNumeroEquipeDto {
  equipe: { id: string; nome: string };
  numero: number;
}

export class AtletaRespostaDto extends PessoaRespostaDto {
  id: string;
  numero: number;
  idEquipe: string;

  constructor(atleta: Atleta) {
    super(atleta.pessoa);

    this.id = atleta.id;
    this.numero = atleta.numero;
    this.idEquipe = atleta.idEquipe;
  }
}

export class AtletaComEquipeRespostaDto extends AtletaRespostaDto {
  equipe: EquipeRespostaDto;

  constructor(atleta: Atleta) {
    super(atleta);

    this.equipe = new EquipeRespostaDto(atleta.equipe);
  }
}
