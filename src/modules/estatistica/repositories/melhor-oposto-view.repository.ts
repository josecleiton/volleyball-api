import { CustomRepository } from 'src/modules/core';
import { SelectQueryBuilder } from 'typeorm';
import { MelhorOpostoView } from '../entities';
import { nomeMelhorOpostoView } from '../estatistica.constants';
import { MelhorPosicaoViewRepository } from './melhor-posicao-view.repository';

@CustomRepository(MelhorOpostoView)
export class MelhorOpostoViewRepository extends MelhorPosicaoViewRepository<MelhorOpostoView> {
  protected readonly name = nomeMelhorOpostoView;
  protected readonly concurrently = true;
  protected adicionaOrdenacao(
    qb: SelectQueryBuilder<MelhorOpostoView>,
  ): SelectQueryBuilder<MelhorOpostoView> {
    return qb
      .addOrderBy('m.pontosPorPartida', 'DESC')
      .addOrderBy('m.ataquesEfetivos', 'DESC')
      .addOrderBy('m.acesPorPartida', 'DESC')
      .addOrderBy('m.saquesEfetivos', 'DESC');
  }
}
