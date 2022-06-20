import { EquipeRespostaDto } from 'src/modules/equipe/dto/equipe.dto';
import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { PontuacaoView } from '../entities/pontuacao-view.entity';

export class PontuacaoDto {
  idEquipe: string;
  pontuacao: number;
  setsGanhos: number;
  setsDisputados: number;
  setsPerdidos: number;
  pontosAverage: number;
  setsAverage: number;
  partidasGanhas: number;
  partidasPerdidas: number;
  partidasDisputadas: number;
  equipe: Equipe;

  constructor(pontuacaoView: PontuacaoView) {
    this.idEquipe = pontuacaoView.idEquipe;
    this.pontuacao = parseInt(pontuacaoView.pontuacao);
    this.setsGanhos = parseInt(pontuacaoView.setsGanhos);
    this.setsDisputados = parseInt(pontuacaoView.setsDisputados);
    this.setsPerdidos = parseInt(pontuacaoView.setsPerdidos);
    this.pontosAverage = parseFloat(pontuacaoView.pontosAverage);
    this.setsAverage = parseFloat(pontuacaoView.setsAverage);
    this.partidasGanhas = parseInt(pontuacaoView.partidasGanhas);
    this.partidasPerdidas = parseInt(pontuacaoView.partidasPerdidas);
    this.partidasDisputadas = parseInt(pontuacaoView.partidasDisputadas);
    this.equipe = pontuacaoView.equipe;
  }
}
export class PontuacaoRespostaDto {
  idEquipe: string;
  setsGanhos: number;
  setsPerdidos: number;
  setsDisputados: number;
  partidasGanhas: number;
  partidasPerdidas: number;
  partidasDisputadas: number;
  pontuacao: number;
  pontosAverage: number;
  setsAverage: number;

  equipe: EquipeRespostaDto;

  constructor(p: PontuacaoDto) {
    this.idEquipe = p.idEquipe;
    this.setsGanhos = p.setsGanhos;
    this.setsPerdidos = p.setsPerdidos;
    this.setsDisputados = p.setsDisputados;
    this.partidasGanhas = p.partidasGanhas;
    this.partidasPerdidas = p.partidasPerdidas;
    this.partidasDisputadas = p.partidasDisputadas;
    this.pontuacao = p.pontuacao;
    this.pontosAverage = p.pontosAverage;
    this.setsAverage = p.setsAverage;

    this.equipe = new EquipeRespostaDto(p.equipe);
  }
}
