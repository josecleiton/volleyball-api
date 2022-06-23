import { Posicao } from 'src/modules/pessoa/enums';
import { AtletaEscalado } from '../entities/atleta-escalado.entity';
import { EquipePartidaRespostaDto } from './equipe-partida.dto';

export interface IBuscaAtletaEscalado {
  idAtleta: string;
  idPartida: string;
}

export class AtletaEscaladoRespostaDto {
  id: string;
  idAtleta: string;
  idPartida: string;
  posicao: Posicao;
  dataCriacao: Date;
  participacao: EquipePartidaRespostaDto;

  constructor(atleta: AtletaEscalado) {
    this.id = atleta.id;
    this.idAtleta = atleta.idAtleta;
    this.idPartida = atleta.idEquipePartida;
    this.posicao = atleta.posicao;
    this.dataCriacao = atleta.dataCriacao;
    this.participacao = new EquipePartidaRespostaDto(atleta.participacao);
  }
}
