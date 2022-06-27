import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { MelhorPosicaoViewRepository } from './melhor-posicao-view.repository';
import { nomeMelhorOpostoView } from '../estatistica.constants';
import { MelhorOpostoView } from '../entities/melhor-oposto-view.entity';

@EntityRepository(MelhorOpostoView)
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
