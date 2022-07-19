import { IsString, Length, IsPositive, IsOptional } from 'class-validator';
import { Ginasio } from '../entities';

export class CriaGinasioDto {
  @IsString()
  @Length(2, 250)
  nome!: string;

  @IsString()
  @Length(2, 250)
  cidade!: string;

  @IsString()
  @Length(2, 2)
  estado!: string;

  @IsPositive()
  @IsOptional()
  capacidade = 1000;
}

export class ListaGinasiosDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  cidade?: string;

  @IsString()
  @Length(2, 2)
  @IsOptional()
  estado?: string;
}

export class GinasioRespostaDto {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  dataCriacao: Date;
  capacidade: number;

  constructor(ginasio: Ginasio) {
    this.id = ginasio.id;
    this.nome = ginasio.nome;
    this.cidade = ginasio.cidade;
    this.estado = ginasio.estado;
    this.dataCriacao = ginasio.dataCriacao;
    this.capacidade = ginasio.capacidade;
  }
}
