import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { Partida } from '../entities/partida.entity';
import { PartidaStatus } from '../enums/partida-status.enum';

export class CriaPartidaDto {
  @IsUUID()
  idDelegado!: string;

  @IsUUID()
  idArbitro!: string;

  @IsUUID()
  idGinasio!: string;

  @IsEnum(PartidaStatus)
  @IsOptional()
  status: PartidaStatus = PartidaStatus.AGENDADA;

  @IsUUID()
  idMandante!: string;

  @IsUUID()
  idVisitante!: string;
}

export class AtualizaPartidaStatusDto {
  @IsEnum(PartidaStatus)
  status!: PartidaStatus;
}

export class PartidaRespostaDto {
  idDelegado: string;
  idArbitro: string;
  idGinasio: string;
  status: PartidaStatus;
  comecouEm?: Date;
  finalizouEm?: Date;
  idEquipeGanhador?: string;
  idEquipePerdedor?: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
  duracaoBruta?: number;

  constructor(partida: Partida) {
    this.idDelegado = partida.idDelegado;
    this.idArbitro = partida.idArbitro;
    this.idGinasio = partida.idGinasio;
    this.status = partida.status;
    this.comecouEm = partida.dataComeco;
    this.finalizouEm = partida.dataFinalizacao;
    this.idEquipeGanhador = partida.idEquipeGanhador;
    this.dataCriacao = partida.dataCriacao;
    this.dataAtualizacao = partida.dataAtualizacao;
    this.duracaoBruta = partida.duracaoBruta;
  }
}
