import { Posicao, AtletaRespostaDto } from 'src/modules/pessoa';
import { AtletaEscalado } from '../entities';
import { EquipePartidaRespostaDto } from './equipe-partida.dto';

export interface IBuscaAtletaEscalado {
  idAtleta: string;
  idPartida: string;
}

export class AtletaEscaladoSimplesRespostaDto {
  id: string;
  idAtleta: string;
  idPartida: string;
  posicao: Posicao;
  dataCriacao: Date;

  constructor(atleta: AtletaEscalado) {
    this.id = atleta.id;
    this.idAtleta = atleta.idAtleta;
    this.idPartida = atleta.idEquipePartida;
    this.posicao = atleta.posicao;
    this.dataCriacao = atleta.dataCriacao;
  }
}
export class AtletaEscaladoRespostaDto extends AtletaEscaladoSimplesRespostaDto {
  participacao: EquipePartidaRespostaDto;

  constructor(atleta: AtletaEscalado) {
    super(atleta);

    this.participacao = new EquipePartidaRespostaDto(atleta.participacao);
  }
}

export class AtletaEscaladoComPerfilAtletaRespostaDto extends AtletaEscaladoSimplesRespostaDto {
  atleta: AtletaRespostaDto;

  constructor(atleta: AtletaEscalado) {
    super(atleta);

    this.atleta = new AtletaRespostaDto(atleta.atleta);
  }
}
