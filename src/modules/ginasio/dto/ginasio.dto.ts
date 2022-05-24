import { IsOptional, IsString, Length } from 'class-validator';
import { Ginasio } from '../entities/ginasio.entity';

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

  constructor(ginasio: Ginasio) {
    this.id = ginasio.id;
    this.nome = ginasio.nome;
    this.cidade = ginasio.cidade;
    this.estado = ginasio.estado;
    this.dataCriacao = ginasio.dataCriacao;
  }
}
