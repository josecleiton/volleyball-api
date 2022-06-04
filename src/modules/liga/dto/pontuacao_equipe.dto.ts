import { BadRequestException } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsUUID,
} from 'class-validator';

export interface IPontuacaoDto {
  pontuacao: number;
  id: string;
}

export interface IEquipePontuacaoDto {
  id: string;
  nome: string;
  idLiga: string;
  idGinasio: string;
}

export interface IListaPontuacaoDaLigaOrdenadaResposta {
  equipeId: string;
  equipeNome: string;
  equipeIdGinasio: string;
  ligaId: string;
  pontuacao: number;
}

export enum EscolhaDeMando {
  PRIMEIRO_JOGO = 'primeiro',
  SEGUNDO_JOGO = 'segundo',
}

export interface IMataMataDto {
  datas: Date[];
  mandos: EscolhaDeMando[];
  idLiga: string;
}

export class InicializaQuartaDeFinalDto {
  @IsArray()
  @ArrayMinSize(12)
  @ArrayMaxSize(12)
  @IsDate({ each: true })
  @Type(() => Date)
  datas!: Date[];

  @IsArray()
  @IsEnum(EscolhaDeMando)
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  mandos!: EscolhaDeMando[];

  valida() {
    this.datas.forEach((data, index) => {
      if (data instanceof Date && !isFinite(data.getTime())) {
        throw new BadRequestException(`'datas[${index}]' não fornecida`);
      }
    });
  }
}

export class QuartaDeFinalDto
  extends InicializaQuartaDeFinalDto
  implements IMataMataDto
{
  @IsUUID()
  idLiga!: string;
}

export class PontuacaoEquipeRespostaDto {
  pontuacao: number;
  equipe: IEquipePontuacaoDto;

  constructor(
    pontuacaoOrdenadaResposta: IListaPontuacaoDaLigaOrdenadaResposta,
  ) {
    this.pontuacao = pontuacaoOrdenadaResposta.pontuacao;
    this.equipe = {
      id: pontuacaoOrdenadaResposta.equipeId,
      idLiga: pontuacaoOrdenadaResposta.ligaId,
      nome: pontuacaoOrdenadaResposta.equipeNome,
      idGinasio: pontuacaoOrdenadaResposta.equipeIdGinasio,
    };
  }
}
