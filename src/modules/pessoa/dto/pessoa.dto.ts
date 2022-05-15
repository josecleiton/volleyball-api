import { IsEnum, IsInt, IsString, Length, Max, Min } from 'class-validator';
import { Genero } from 'src/modules/core/enums';
import { Pessoa } from '../entities/pessoa.entity';

export class CriaPessoa {
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
  @Length(10, 10)
  documentoCbv!: string;

  paraPessoa(): Pessoa {
    return Object.assign(new Pessoa(), this);
  }
}

export class PessoaResposta {
  nome: string;
  documento: string;
  genero: Genero;
  idade: number;
  documentoCbv: string;

  constructor(pessoa: Pessoa) {
    this.nome = pessoa.nome;
    this.documento = pessoa.documento;
    this.genero = pessoa.idade;
    this.documentoCbv = pessoa.documentoCbv;
    this.idade = pessoa.idade;
  }
}
