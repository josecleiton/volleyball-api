import { BadRequestException } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsString, Length } from 'class-validator';
import { differenceInYears } from 'date-fns';
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

  @IsDate()
  @Type(() => Date)
  dataNascimento!: Date;

  @IsString()
  @Length(11, 11)
  documentoCbv!: string;

  paraPessoa(tipo: TipoPessoa): Pessoa {
    return Object.assign(new Pessoa(tipo), this);
  }

  private static idadeLimite = 15;

  validar() {
    if (
      differenceInYears(new Date(), this.dataNascimento) <
      CriaPessoaDto.idadeLimite
    ) {
      throw new BadRequestException(
        `Idade menor que ${CriaPessoaDto.idadeLimite} anos`,
      );
    }
  }
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
    this.idade = pessoa.idade;
  }
}
