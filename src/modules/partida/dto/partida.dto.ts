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
import { EquipeRespostaDto } from 'src/modules/equipe/dto/equipe.dto';
import { Posicao, TipoArbitro } from 'src/modules/pessoa/enums';
import { Partida } from '../entities/partida.entity';
import { PartidaStatus } from '../enums/partida-status.enum';
import { TipoRodada, tiposDeRodada } from '../types/tipo-rodada.type';

export class AtualizaPartidaStatusDto {
  @IsEnum(PartidaStatus)
  status!: PartidaStatus;
}

export class AtletaPartidaDto {
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
  atletasMandante!: AtletaPartidaDto[];

  @IsArray()
  @ArrayMinSize(12)
  @ArrayMaxSize(14)
  @ValidateNested({ each: true })
  atletasVisitante!: AtletaPartidaDto[];

  @IsIn(['mandante', 'visitante'])
  @IsOptional()
  desistente?: 'mandante' | 'visitante';
}

export class ListaPartidasDto {
  @IsUUID()
  idLiga!: string;

  @IsIn(tiposDeRodada)
  tipoPartida?: TipoRodada;

  @IsPositive()
  limite? = 51;
}

export class PartidaRespostaDto {
  id: string;
  idDelegado?: string;
  idGinasio: string;
  idEquipeMandante: string;
  idEquipeVisitante: string;
  status: PartidaStatus;
  dataComeco: Date;
  dataFinalizacao?: Date;
  idEquipeGanhador?: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
  duracaoBruta?: number;
  equipeGanhadora?: EquipeRespostaDto;
  tipoRodada: TipoRodada;

  constructor(partida: Partida) {
    this.id = partida.id;
    this.idDelegado = partida.idDelegado;
    this.idGinasio = partida.idGinasio;
    this.status = partida.status;
    this.dataComeco = partida.dataComeco;
    this.dataFinalizacao = partida.dataFinalizacao;
    this.idEquipeGanhador = partida.idEquipeGanhadora;
    this.dataCriacao = partida.dataCriacao;
    this.dataAtualizacao = partida.dataAtualizacao;
    this.duracaoBruta = partida.duracaoBruta;
    this.idEquipeMandante = partida.idMandante;
    this.idEquipeVisitante = partida.idVisitante;
    this.equipeGanhadora = partida.equipeGanhadora
      ? new EquipeRespostaDto(partida.equipeGanhadora)
      : undefined;
    this.tipoRodada = partida.tipoDaRodada;
  }
}
