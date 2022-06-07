import { EquipeRespostaDto } from 'src/modules/equipe/dto/equipe.dto';
import { EquipePartida } from '../entities/equipe-partida.entity';

export class EquipePartidaRespostaDto {
  id: string;
  idEquipe: string;
  idPartida: string;
  pontuacao: number;
  setsGanhos: number;
  resultadoCadastradoEm?: Date;
  equipe: EquipeRespostaDto;
  pontosNosSets: number[];

  public get setsJogados() {
    return this.pontosNosSets.length;
  }

  constructor(e: EquipePartida) {
    this.id = e.id;
    this.idEquipe = e.idEquipe;
    this.idPartida = e.idPartida;
    this.pontuacao = e.pontuacao;
    this.setsGanhos = e.setsGanhos;
    this.pontosNosSets = e.pontosNosSets;
    this.resultadoCadastradoEm = e.resultadoCadastradoEm;
    this.equipe = new EquipeRespostaDto(e.equipe);
  }
}
