import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsIn,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Posicao, TipoArbitro } from 'src/modules/pessoa/enums';
import { Partida } from '../entities/partida.entity';
import { PartidaStatus } from '../enums/partida-status.enum';

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

  constructor(partida: Partida) {
    this.id = partida.id;
    this.idDelegado = partida.idDelegado;
    this.idGinasio = partida.idGinasio;
    this.status = partida.status;
    this.dataComeco = partida.dataComeco;
    this.dataFinalizacao = partida.dataFinalizacao;
    this.idEquipeGanhador = partida.idEquipeGanhador;
    this.dataCriacao = partida.dataCriacao;
    this.dataAtualizacao = partida.dataAtualizacao;
    this.duracaoBruta = partida.duracaoBruta;
    this.idEquipeMandante = partida.idMandante;
    this.idEquipeVisitante = partida.idVisitante;
  }
}
