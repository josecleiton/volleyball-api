import { BadRequestException } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { compareAsc } from 'date-fns';
import { Genero } from 'src/modules/core/enums';
import { DiaDaSemana } from 'src/modules/core/enums/dia-da-semana.enum';
import { PartidaRespostaDto } from 'src/modules/partida/dto/partida.dto';
import { Partida } from 'src/modules/partida/entities/partida.entity';
import { ArbitroRespostaDto } from 'src/modules/pessoa/dto/arbitro.dto';
import { DelegadoRespostaDto } from 'src/modules/pessoa/dto/delegado.dto';
import { Liga } from '../entities/liga.entity';

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
  @IsDate()
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
  @Min(6 * 60, { each: true })
  @Max(22 * 60, { each: true })
  horarios!: number[];

  valida() {
    if (this.data instanceof Date && !isFinite(this.data.getTime())) {
      throw new BadRequestException("'data' não fornecida");
    }
  }
}

export class LigaRespostaDto {
  id: string;
  genero: string;
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
    this.nome = liga.nome;
    this.serie = liga.serie;
    this.ano = liga.ano;
    this.arbitros = liga.arbitros?.map((x) => new ArbitroRespostaDto(x));
    this.delegados = liga.delegados?.map((x) => new DelegadoRespostaDto(x));
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
