import { IsEnum, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { Genero } from 'src/modules/core/enums';
import { Liga } from '../entities/liga.entity';

export class CriaLigaDto {
  @IsEnum(Genero)
  genero!: Genero;

  @IsString()
  @Length(4)
  ano!: string;

  @IsOptional()
  @IsString()
  @Length(2, 200)
  nome?: string;

  @IsOptional()
  @IsString()
  @Length(2, 20)
  serie?: string;
}

export class InicializaLigaDto {
  @IsUUID()
  id!: string;
}

export class LigaRespostaDto {
  id: string;
  genero: string;
  iniciadaEm?: Date;
  nome?: string;
  serie?: string;

  constructor(liga: Liga) {
    this.id = liga.id;
    this.genero = liga.genero;
    this.iniciadaEm = liga.iniciadaEm;
    this.nome = liga.nome;
    this.serie = liga.serie;
  }
}
