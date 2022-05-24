import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, IsUUID, Length } from 'class-validator';
import { Equipe } from '../entities/equipe.entity';

export class CriaEquipeDto {
  @IsUUID()
  idLiga!: string;

  @IsUUID()
  idGinasio!: string;

  @IsString()
  @Length(2, 200)
  nome!: string;

  @IsUrl()
  @IsOptional()
  urlBrasao?: string;

  @IsString()
  @Length(2, 200)
  cidade!: string;

  @IsString()
  @Length(2, 2)
  estado!: string;
}

export class AtualizaEquipeDto extends PartialType(CriaEquipeDto) {}

export class ListaEquipesDto {
  idLiga?: string;
}

export class EquipeRespostaDto {
  id: string;
  nome: string;
  urlBrasao?: string;
  apta: boolean;
  descricaoAptidao?: string[];
  cidade: string;
  estado: string;
  idLiga: string;
  idGinasio: string;
  quantidadeAtletas: number;

  constructor(equipe: Equipe) {
    this.id = equipe.id;
    this.nome = equipe.nome;
    this.urlBrasao = equipe.urlBrasao;
    this.apta = equipe.apta;
    this.descricaoAptidao = equipe.descricaoAptidao;
    this.cidade = equipe.cidade;
    this.estado = equipe.estado;
    this.idLiga = equipe.idLiga;
    this.idGinasio = equipe.idGinasio;
    this.quantidadeAtletas = equipe.atletas.length;
  }
}
