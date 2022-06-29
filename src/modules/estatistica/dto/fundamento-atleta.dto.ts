import { Expose } from 'class-transformer';
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

export class ListaFundamentoNaLigaDto {
  @IsUUID()
  idLiga!: string;
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

  saquesEfetivos: number;
  ataquesEfetivos: number;

  constructor(fundamento: FundamentoAtleta) {
    this.id = fundamento.id;
    this.idAtletaPartida = fundamento.idAtletaEscalado;
    this.bloqueios = fundamento.bloqueios;
    this.recepcoes = fundamento.recepcoes;
    this.aces = fundamento.aces;
    this.saques = fundamento.saques;
    this.ataques = fundamento.ataques;
    this.pontos = fundamento.pontos;
    this.saquesEfetivos = fundamento.saquesEfetivos;
    this.ataquesEfetivos = fundamento.ataquesEfetivos;
  }
}

export class FundamentoAgregadoAtletaRespostaDto {
  idAtleta!: string;
  bloqueios!: number;
  recepcoes!: number;
  aces!: number;
  saques!: number;
  ataques!: number;
  pontos!: number;
  levantamentos!: number;
  assistencias!: number;

  @Expose()
  public get saquesEfetivos(): number {
    if (!this.saques) return 0;
    return this.aces / this.saques;
  }

  @Expose()
  public get ataquesEfetivos(): number {
    if (!this.ataques) return 0;
    return this.pontos / this.ataques;
  }

  @Expose()
  public get levantamentosEfetivos(): number {
    if (!this.levantamentos) return 0;
    return this.assistencias / this.levantamentos;
  }
}
