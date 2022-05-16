import { IsEnum, IsInt, IsString, Length, Max, Min } from 'class-validator';
import { Genero } from 'src/modules/core/enums';
import { Pessoa } from '../entities/pessoa.entity';
import { TipoPessoa } from '../enums';

export class CriaPessoaDto {
  @IsString()
  @Length(3, 255)
  nome!: string;

  @IsString()
  @Length(7, 200)
  documento!: string;

  @IsEnum(Genero)
  genero!: Genero;

  @IsInt()
  @Min(10)
  @Max(100)
  idade!: number;

  @IsString()
  @Length(11, 11)
  documentoCbv!: string;

  paraPessoa(): Pessoa {
    return Object.assign(new Pessoa(TipoPessoa.tecnico), this);
  }
}

export class PessoaRespostaDto {
  nome: string;
  documento: string;
  genero: Genero;
  idade: number;
  documentoCbv: string;

  constructor(pessoa: Pessoa) {
    this.nome = pessoa.nome;
    this.documento = pessoa.documento;
    this.genero = pessoa.genero;
    this.idade = pessoa.idade;
    this.documentoCbv = pessoa.documentoCbv;
    this.idade = pessoa.idade;
  }
}
