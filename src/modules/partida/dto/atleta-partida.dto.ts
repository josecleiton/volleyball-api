import { EquipeRespostaDto } from 'src/modules/equipe/dto/equipe.dto';
import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { Posicao } from 'src/modules/pessoa/enums';
import { AtletaPartida } from '../entities/atleta-partida.entity';
import { PartidaRespostaDto } from './partida.dto';

export interface IBuscaAtletaPartida {
  idAtleta: string;
  idPartida: string;
}

export class AtletaPartidaRespostaDto {
  id: string;
  idAtleta: string;
  idPartida: string;
  posicao: Posicao;
  dataCriacao: Date;
  partida: PartidaRespostaDto;

  constructor(atleta: AtletaPartida) {
    this.id = atleta.id;
    this.idAtleta = atleta.idAtleta;
    this.idPartida = atleta.idPartida;
    this.posicao = atleta.posicao;
    this.dataCriacao = atleta.dataCriacao;
    this.partida = new PartidaRespostaDto(atleta.partida);
  }
}

export class AtletaPartidaComGanhadoraRespostaDto extends AtletaPartidaRespostaDto {
  equipeGanhadora: EquipeRespostaDto;
  constructor(atleta: AtletaPartida, equipe: Equipe) {
    super(atleta);

    this.equipeGanhadora = new EquipeRespostaDto(equipe);
  }
}
