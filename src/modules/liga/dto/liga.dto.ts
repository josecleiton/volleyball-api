import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
  MinDate,
} from 'class-validator';
import { compareAsc, startOfYear } from 'date-fns';
import { Genero } from 'src/modules/core/enums';
import { DiaDaSemana } from 'src/modules/core/enums/dia-da-semana.enum';
import { IsTimeString } from 'src/modules/core/validations';
import { PartidaRespostaDto } from 'src/modules/partida/dto/partida.dto';
import { Partida } from 'src/modules/partida/entities/partida.entity';
import { ArbitroRespostaDto } from 'src/modules/pessoa/dto/arbitro.dto';
import { DelegadoRespostaDto } from 'src/modules/pessoa/dto/delegado.dto';
import { Liga } from '../entities/liga.entity';
import { StatusLiga } from '../enums/status-liga.enum';

export class CriaLigaDto {
  @IsEnum(Genero)
  genero!: Genero;

  @IsOptional()
  @IsString()
  @Length(2, 200)
  nome?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  serie?: string;
}

export class InicializaLigaDto {
  @MinDate(startOfYear(new Date()))
  @Type(() => Date)
  data?: Date;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(6)
  @ArrayUnique()
  @IsEnum(DiaDaSemana, { each: true })
  diasDaSemana!: DiaDaSemana[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(12)
  @ArrayUnique()
  @IsTimeString({ each: true })
  @ApiProperty({ example: ['21:00'], type: [String] })
  horarios!: string[];

  @IsPositive()
  @Max(Liga.intervaloDeUteisDiasEntreTurnos)
  @IsOptional()
  intervaloDeDiasUteisEntreTurnos = Liga.intervaloDeUteisDiasEntreTurnos;
}

export class LigaRespostaDto {
  id: string;
  genero: string;
  status: StatusLiga;
  dataComeco?: Date;
  nome?: string;
  serie?: string;
  ano?: number;
  arbitros?: ArbitroRespostaDto[];
  delegados?: DelegadoRespostaDto[];

  constructor(liga: Liga) {
    this.id = liga.id;
    this.genero = liga.genero;
    this.dataComeco = liga.dataComeco;
    this.status = liga.status;
    this.nome = liga.nome;
    this.serie = liga.serie;
    this.ano = liga.ano;
    this.arbitros = liga.arbitros?.map((x) => new ArbitroRespostaDto(x));
    this.delegados = liga.delegados?.map((x) => new DelegadoRespostaDto(x));
  }
}

export abstract class GeraPartidasLigaRespostaDto {
  liga: LigaRespostaDto;
  partidas: PartidaRespostaDto[];

  constructor(liga: Liga, partidas: Partida[]) {
    this.liga = new LigaRespostaDto(liga);
    this.partidas = partidas
      .sort((a, b) => compareAsc(a.dataComeco, b.dataComeco))
      .map((x) => new PartidaRespostaDto(x));
  }
}
export class InicializaLigaRespostaDto extends GeraPartidasLigaRespostaDto {
  constructor(liga: Liga, partidas: Partida[]) {
    super(liga, partidas);
  }
}

export class QuartasLigaRespostaDto extends GeraPartidasLigaRespostaDto {
  constructor(liga: Liga, partidas: Partida[]) {
    super(liga, partidas);
  }
}

export class SemisLigaRespostaDto extends GeraPartidasLigaRespostaDto {
  constructor(liga: Liga, partidas: Partida[]) {
    super(liga, partidas);
  }
}

export class FinalLigaRespostaDto extends GeraPartidasLigaRespostaDto {
  constructor(liga: Liga, partidas: Partida[]) {
    super(liga, partidas);
  }
}
