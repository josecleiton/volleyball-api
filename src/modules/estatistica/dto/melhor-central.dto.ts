import { MelhorCentralView } from '../entities/melhor-central-view.entity';
import { MelhorPosicaoRespostaDto } from './melhor-posicao.dto';

export class MelhorCentralRespostaDto extends MelhorPosicaoRespostaDto {
  bloqueiosPorPartida: number;
  quantidadeDePartidas: number;

  public get totalDeBloqueios(): number {
    return this.bloqueiosPorPartida * this.quantidadeDePartidas;
  }

  constructor(m: MelhorCentralView) {
    super(m.atleta);

    this.bloqueiosPorPartida = m.bloqueiosPorPartida;
    this.quantidadeDePartidas = m.quantidadePartidas;
  }
}
