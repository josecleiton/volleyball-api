import { IsOptional, IsUUID, Max, Min } from 'class-validator';
import { FundamentoAtleta } from '../entities/fundamento-atleta.entity';

export class CriaFundamentoAtletaDto {
  @IsUUID()
  idPartida!: string;

  @IsUUID()
  idAtleta!: string;

  @Min(0)
  @Max(200)
  @IsOptional()
  bloqueios?: number;

  @Min(0)
  @Max(200)
  @IsOptional()
  recepcoes?: number;

  @Min(0)
  @Max(200)
  @IsOptional()
  aces?: number;

  @Min(0)
  @Max(200)
  @IsOptional()
  saques?: number;

  @Min(0)
  @Max(200)
  @IsOptional()
  ataques?: number;

  @Min(0)
  @Max(200)
  @IsOptional()
  pontos?: number;
}

export class FundamentoAtletaRespostaDto {
  id: string;
  idAtletaPartida: string;
  bloqueios: number;
  recepcoes: number;
  aces: number;
  saques: number;
  ataques: number;
  pontos: number;

  mediasDeAcesPorSaque: number;
  mediaDePontosPorAtaque: number;

  constructor(fundamento: FundamentoAtleta) {
    this.id = fundamento.id;
    this.idAtletaPartida = fundamento.idAtletaPartida;
    this.bloqueios = fundamento.bloqueios;
    this.recepcoes = fundamento.recepcoes;
    this.aces = fundamento.aces;
    this.saques = fundamento.saques;
    this.ataques = fundamento.ataques;
    this.pontos = fundamento.pontos;
    this.mediasDeAcesPorSaque = fundamento.mediasDeAcesPorSaque;
    this.mediaDePontosPorAtaque = fundamento.mediaDePontosPorAtaque;
  }
}
