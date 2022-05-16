import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { Equipe } from '../entities/equipe.entity';

export class CriaEquipeDto {
  @IsString()
  @Length(2, 200)
  nome!: string;

  @IsUrl()
  @IsOptional()
  urlBrasao?: string;
}

export class AtualizaEquipeDto extends PartialType(CriaEquipeDto) {}

export class EquipeRespostaDto {
  id: string;
  nome: string;
  urlBrasao?: string;
  apta: boolean;
  descricaoAptidao?: unknown;

  constructor(equipe: Equipe) {
    this.id = equipe.id;
    this.nome = equipe.nome;
    this.urlBrasao = equipe.urlBrasao;
    this.apta = equipe.apta;
    this.descricaoAptidao = equipe.descricaoAptidao;
  }
}
