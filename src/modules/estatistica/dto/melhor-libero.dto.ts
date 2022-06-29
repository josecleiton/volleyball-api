import { MelhorLiberoView } from '../entities/melhor-libero-view.entity';
import { MelhorPosicaoRespostaDto } from './melhor-posicao.dto';

export class MelhorLiberoRespostaDto extends MelhorPosicaoRespostaDto {
  recepcoesPorPartida: number;
  quantidadeDePartidas: number;

  public get totalDeRecepcoes(): number {
    return this.recepcoesPorPartida * this.quantidadeDePartidas;
  }

  constructor(ml: MelhorLiberoView) {
    super(ml.atleta);

    this.recepcoesPorPartida = ml.recepcoesPorPartida;
    this.quantidadeDePartidas = ml.quantidadePartidas;
  }
}
