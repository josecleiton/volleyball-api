import { IsEnum } from 'class-validator';
import { Partida } from '../entities/partida.entity';
import { PartidaStatus } from '../enums/partida-status.enum';

export class AtualizaPartidaStatusDto {
  @IsEnum(PartidaStatus)
  status!: PartidaStatus;
}

export class PartidaRespostaDto {
  id: string;
  idDelegado?: string;
  idArbitro?: string;
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
    this.idArbitro = partida.idArbitro;
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
