import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsUUID,
} from 'class-validator';

export interface ITabelaDto {
  pontuacao: number;
  id: string;
}

export interface IEquipeTabelaDto {
  id: string;
  nome: string;
  idLiga: string;
  idGinasio: string;
}

export interface IListaTabelaOrdenadaPorEquipeResposta {
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

export class QuartaDeFinalDto implements IMataMataDto {
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

  @IsUUID()
  idLiga!: string;
}

export class TabelaRespostaDto {
  pontuacao: number;
  equipe: IEquipeTabelaDto;

  constructor(
    listaTabelaOrdenadaResposta: IListaTabelaOrdenadaPorEquipeResposta,
  ) {
    this.pontuacao = listaTabelaOrdenadaResposta.pontuacao;
    this.equipe = {
      id: listaTabelaOrdenadaResposta.equipeId,
      idLiga: listaTabelaOrdenadaResposta.ligaId,
      nome: listaTabelaOrdenadaResposta.equipeNome,
      idGinasio: listaTabelaOrdenadaResposta.equipeIdGinasio,
    };
  }
}
