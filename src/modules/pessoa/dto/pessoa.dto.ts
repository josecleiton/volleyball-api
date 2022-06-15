import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Length, MaxDate } from 'class-validator';
import { startOfYear, subYears } from 'date-fns';
import { Genero } from 'src/modules/core/enums';
import { Pessoa } from '../entities/pessoa.entity';

export class CriaPessoaDto {
  @IsString()
  @Length(3, 255)
  nome!: string;

  @IsString()
  @Length(7, 200)
  documento!: string;

  @IsEnum(Genero)
  genero!: Genero;

  @MaxDate(subYears(startOfYear(new Date()), CriaPessoaDto.idadeLimite))
  @Type(() => Date)
  dataNascimento!: Date;

  @IsString()
  @Length(11, 11)
  documentoCbv!: string;

  static readonly idadeLimite = 15;
}

export class AtualizaPessoaDto {
  @IsOptional()
  @IsString()
  @Length(3, 255)
  nome?: string;

  @IsOptional()
  @IsEnum(Genero)
  genero?: Genero;

  @IsOptional()
  @MaxDate(subYears(startOfYear(new Date()), CriaPessoaDto.idadeLimite))
  @Type(() => Date)
  dataNascimento?: Date;
}

export class PessoaRespostaDto {
  idPessoa: string;
  nome: string;
  documento: string;
  genero: Genero;
  idade: number;
  documentoCbv: string;

  constructor(pessoa: Pessoa) {
    this.idPessoa = pessoa.id;
    this.nome = pessoa.nome;
    this.documento = pessoa.documento;
    this.genero = pessoa.genero;
    this.idade = pessoa.idade;
    this.documentoCbv = pessoa.documentoCbv;
  }
}
