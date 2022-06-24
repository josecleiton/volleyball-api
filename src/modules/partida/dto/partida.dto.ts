import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsIn,
  IsOptional,
  IsPositive,
  IsUUID,
  Max,
  ValidateNested,
} from 'class-validator';
import { IsValidDate } from 'src/modules/core/validations';
import { Liga } from 'src/modules/liga/entities/liga.entity';
import { Posicao, TipoArbitro } from 'src/modules/pessoa/enums';
import { Partida } from '../entities/partida.entity';
import { StatusPartida } from '../enums/status-partida.enum';
import { TipoRodada, tiposDeRodada } from '../types/tipo-rodada.type';
import { EquipePartidaRespostaDto } from './equipe-partida.dto';

export class AtualizaPartidaStatusDto {
  @IsEnum(StatusPartida)
  status!: StatusPartida;
}

export class AtletaParticipacaoDto {
  @IsUUID()
  idAtleta!: string;

  @IsEnum(Posicao)
  posicao!: Posicao;
}

export class ArbitroPartidaDto {
  @IsUUID()
  idArbitro!: string;

  @IsEnum(TipoArbitro)
  tipo!: TipoArbitro;
}

export enum EscolhaDeDesistencia {
  MANDANTE = 'mandante',
  VISITANTE = 'visitante',
}

export class CadastrarParticipantesPartidaDto {
  @IsUUID()
  idDelegado!: string;

  @IsArray()
  @ArrayMinSize(Partida.quantidadeÁrbitrosPrimários)
  @ArrayMaxSize(Partida.quantidadeDeÁrbitros)
  @ValidateNested({ each: true })
  @Type(() => ArbitroPartidaDto)
  arbitros!: ArbitroPartidaDto[];

  @IsArray()
  @ArrayMinSize(Partida.minimoDeAtletasNaPartida)
  @ArrayMaxSize(Partida.maximoDeAtletasNaPartida)
  @ValidateNested({ each: true })
  @Type(() => AtletaParticipacaoDto)
  atletasMandante!: AtletaParticipacaoDto[];

  @IsArray()
  @ArrayMinSize(Partida.minimoDeAtletasNaPartida)
  @ArrayMaxSize(Partida.maximoDeAtletasNaPartida)
  @ValidateNested({ each: true })
  @Type(() => AtletaParticipacaoDto)
  atletasVisitante!: AtletaParticipacaoDto[];

  @IsEnum(EscolhaDeDesistencia)
  @IsOptional()
  desistente?: EscolhaDeDesistencia;
}

export class ListaPartidasDto {
  @IsUUID()
  idLiga!: string;

  @IsIn(tiposDeRodada)
  tipoRodada?: TipoRodada;

  @Type(() => Number)
  @IsPositive()
  @Max(Liga.quantidadeDePartidasNaClassificacao)
  limite? = Liga.quantidadeDePartidasNaClassificacao;
}

export interface IBuscaQuantidadePartidasPorTipoEStatus {
  idLiga: string;
  tiposDeRodada: TipoRodada[];
  statusAceitos: StatusPartida[];
}

export class RemarcarPartidaDto {
  @IsValidDate()
  @Type(() => Date)
  data!: Date;
}

export class PartidaRespostaDto {
  id: string;
  idDelegado?: string;
  idGinasio: string;
  idEquipeMandante: string;
  idEquipeVisitante: string;
  status: StatusPartida;
  dataComeco: Date;
  dataFinalizacao?: Date;
  idEquipeGanhador?: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
  duracaoBruta?: number;
  ganhadora?: EquipePartidaRespostaDto;
  tipoRodada: TipoRodada;
  mandante: EquipePartidaRespostaDto;
  visitante: EquipePartidaRespostaDto;
  finalizada: boolean;

  constructor(partida: Partida) {
    this.id = partida.id;
    this.idDelegado = partida.idDelegado;
    this.idGinasio = partida.idGinasio;
    this.status = partida.status;
    this.dataComeco = partida.dataComeco;
    this.dataFinalizacao = partida.dataFinalizacao;
    this.idEquipeGanhador = partida.idGanhadora;
    this.dataCriacao = partida.dataCriacao;
    this.dataAtualizacao = partida.dataAtualizacao;
    this.duracaoBruta = partida.duracaoBruta;
    this.idEquipeMandante = partida.idMandante;
    this.idEquipeVisitante = partida.idVisitante;
    this.ganhadora = partida.ganhadora
      ? new EquipePartidaRespostaDto(partida.ganhadora)
      : undefined;
    this.tipoRodada = partida.tipoDaRodada;
    this.mandante = new EquipePartidaRespostaDto(partida.mandante);
    this.visitante = new EquipePartidaRespostaDto(partida.visitante);
    this.finalizada = partida.finalizada;
  }
}
