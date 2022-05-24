import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { compareAsc } from 'date-fns';
import { Genero } from 'src/modules/core/enums';
import { PartidaRespostaDto } from 'src/modules/partida/dto/partida.dto';
import { Partida } from 'src/modules/partida/entities/partida.entity';
import { Liga } from '../entities/liga.entity';

export class CriaLigaDto {
  @IsEnum(Genero)
  genero!: Genero;

  @IsDate()
  @Type(() => Date)
  comecaEm!: Date;

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
  dataComeco?: Date;
  nome?: string;
  serie?: string;

  constructor(liga: Liga) {
    this.id = liga.id;
    this.genero = liga.genero;
    this.dataComeco = liga.dataComeco;
    this.nome = liga.nome;
    this.serie = liga.serie;
  }
}

export class InicializaLigaRespostaDto {
  liga: LigaRespostaDto;
  partidas: PartidaRespostaDto[];

  constructor(liga: Liga, partidas: Partida[]) {
    this.liga = new LigaRespostaDto(liga);
    this.partidas = partidas
      .sort((a, b) => compareAsc(a.dataComeco, b.dataComeco))
      .map((x) => new PartidaRespostaDto(x));
  }
}
