import { EquipeRespostaDto } from 'src/modules/equipe/dto/equipe.dto';
import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
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

export class AtletaEscaladoComGanhadoraRespostaDto extends AtletaEscaladoRespostaDto {
  equipeGanhadora: EquipeRespostaDto;
  constructor(atleta: AtletaEscalado, equipe: Equipe) {
    super(atleta);

    this.equipeGanhadora = new EquipeRespostaDto(equipe);
  }
}
