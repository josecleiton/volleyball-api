import { BadRequestException } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { IsValidDate } from 'src/modules/core/validations';

export enum EscolhaDeMando {
  PRIMEIRO_JOGO = 'primeiro',
  SEGUNDO_JOGO = 'segundo',
}

export interface IMataMataDto {
  datas: Date[];
  mandos: EscolhaDeMando[];
  idLiga: string;
}

abstract class InicializaMataMataDto {
  abstract datas: Date[];

  valida() {
    this.datas.forEach((data, index) => {
      if (data instanceof Date && !isFinite(data.getTime())) {
        throw new BadRequestException(`'datas[${index}]' não fornecida`);
      }
    });
  }
}

export class InicializaQuartaDeFinalDto extends InicializaMataMataDto {
  @IsArray()
  @ArrayMinSize(12)
  @ArrayMaxSize(12)
  @IsValidDate({ each: true })
  @Type(() => Date)
  datas!: Date[];

  @IsArray()
  @IsEnum(EscolhaDeMando)
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  mandos!: EscolhaDeMando[];
}

export class InicializaSemifinalDto extends InicializaMataMataDto {
  @IsArray()
  @ArrayMinSize(6)
  @ArrayMaxSize(6)
  @IsValidDate({ each: true })
  @Type(() => Date)
  datas!: Date[];

  @IsArray()
  @IsEnum(EscolhaDeMando)
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  mandos!: EscolhaDeMando[];
}

export class InicializaFinalDto extends InicializaMataMataDto {
  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @IsValidDate({ each: true })
  @Type(() => Date)
  datas!: Date[];

  mando!: EscolhaDeMando;
}

export class QuartaDeFinalDto
  extends InicializaQuartaDeFinalDto
  implements IMataMataDto
{
  @IsUUID()
  idLiga!: string;
}
