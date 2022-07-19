import { CraqueDaGaleraView } from '../entities';
import { MelhorPosicaoRespostaDto } from './melhor-posicao.dto';

export class CraqueDaGaleraRespostaDto extends MelhorPosicaoRespostaDto {
  quantidadeVotos: number;

  constructor(cg: CraqueDaGaleraView) {
    super(cg.atleta);

    this.quantidadeVotos = parseInt(cg.quantidadeVotos);
  }
}
