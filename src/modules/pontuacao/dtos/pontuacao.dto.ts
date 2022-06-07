import { EquipeRespostaDto } from 'src/modules/equipe/dto/equipe.dto';
import { PontuacaoView } from '../entities/pontuacao-view.entity';

export class PontuacaoRespostaDto {
  idEquipe: string;
  setsGanhos: number;
  setsPerdidos: number;
  setsDisputados: number;
  partidasGanhas: number;
  partidasPerdidas: number;
  partidasDisputadas: number;

  equipe: EquipeRespostaDto;

  constructor(p: PontuacaoView) {
    this.idEquipe = p.idEquipe;
    this.setsGanhos = p.setsGanhos;
    this.setsPerdidos = p.setsPerdidos;
    this.setsDisputados = p.setsDisputados;
    this.partidasGanhas = p.partidasGanhas;
    this.partidasPerdidas = p.partidasPerdidas;
    this.partidasDisputadas = p.partidasDisputadas;

    this.equipe = new EquipeRespostaDto(p.equipe);
  }
}
