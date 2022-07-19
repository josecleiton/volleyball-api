import { MelhorOpostoView } from '../entities';
import { MelhorPosicaoRespostaDto } from './melhor-posicao.dto';

export class MelhorPontaRespostaDto extends MelhorPosicaoRespostaDto {
  acesPorPartida: number;
  saquesEfetivos: number;
  quantidadeDePartidas: number;

  public get totalDeAces(): number {
    return this.acesPorPartida * this.quantidadeDePartidas;
  }

  constructor(m: MelhorOpostoView) {
    super(m.atleta);

    this.acesPorPartida = m.acesPorPartida;
    this.saquesEfetivos = m.saquesEfetivos;
    this.quantidadeDePartidas = m.quantidadePartidas;
  }
}
