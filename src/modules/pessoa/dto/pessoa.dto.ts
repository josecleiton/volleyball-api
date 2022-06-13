import { Type } from 'class-transformer';
import { IsEnum, IsString, Length, MinDate } from 'class-validator';
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

  @MinDate(subYears(startOfYear(new Date()), CriaPessoaDto.idadeLimite))
  @Type(() => Date)
  dataNascimento!: Date;

  @IsString()
  @Length(11, 11)
  documentoCbv!: string;

  private static readonly idadeLimite = 15;
}

export class PessoaRespostaDto {
  id: string;
  nome: string;
  documento: string;
  genero: Genero;
  idade: number;
  documentoCbv: string;

  constructor(pessoa: Pessoa) {
    this.id = pessoa.id;
    this.nome = pessoa.nome;
    this.documento = pessoa.documento;
    this.genero = pessoa.genero;
    this.idade = pessoa.idade;
    this.documentoCbv = pessoa.documentoCbv;
  }
}
