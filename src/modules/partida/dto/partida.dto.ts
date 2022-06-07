import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsIn,
  IsOptional,
  IsPositive,
  IsUUID,
  ValidateNested,
} from 'class-validator';
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

class ArbitroPartidaDto {
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
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @ValidateNested({ each: true })
  arbitros!: ArbitroPartidaDto[];

  @IsArray()
  @ArrayMinSize(12)
  @ArrayMaxSize(14)
  @ValidateNested({ each: true })
  atletasMandante!: AtletaParticipacaoDto[];

  @IsArray()
  @ArrayMinSize(12)
  @ArrayMaxSize(14)
  @ValidateNested({ each: true })
  atletasVisitante!: AtletaParticipacaoDto[];

  @IsEnum(EscolhaDeDesistencia)
  @IsOptional()
  desistente?: EscolhaDeDesistencia;
}

export class ListaPartidasDto {
  @IsUUID()
  idLiga!: string;

  @IsIn(tiposDeRodada)
  tipoPartida?: TipoRodada;

  @IsPositive()
  limite? = 51;
}

export interface IBuscaQuantidadePartidasPorTipoEStatus {
  idLiga: string;
  tiposDeRodada: TipoRodada[];
  statusAceitos: StatusPartida[];
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
  }
}
