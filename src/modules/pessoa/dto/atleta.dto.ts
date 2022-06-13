import { OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsUUID, Max } from 'class-validator';
import { EquipeRespostaDto } from 'src/modules/equipe/dto/equipe.dto';
import { Atleta } from '../entities/atleta.entity';
import { CriaPessoaDto, PessoaRespostaDto } from './pessoa.dto';

export class CriaAtletaDto extends CriaPessoaDto {
  @IsPositive()
  @Max(100)
  numero!: number;

  @IsUUID()
  idEquipe!: string;
}

export class AtualizaAtletaDto extends PartialType(
  OmitType(CriaAtletaDto, ['idEquipe', 'documento', 'documentoCbv', 'genero']),
) {}

export class ListaAtletaDto {
  @IsNotEmpty()
  @IsUUID()
  idEquipe!: string;
}

export interface IValidaNumeroEquipeDto {
  equipe: { id: string; nome: string };
  numero: number;
}

export class AtletaRespostaDto extends PessoaRespostaDto {
  id: string;
  numero: number;
  idEquipe: string;
  equipe: EquipeRespostaDto;

  constructor(atleta: Atleta) {
    super(atleta.pessoa);

    this.id = atleta.id;
    this.numero = atleta.numero;
    this.idEquipe = atleta.idEquipe;
    this.equipe = new EquipeRespostaDto(atleta.equipe);
  }
}
