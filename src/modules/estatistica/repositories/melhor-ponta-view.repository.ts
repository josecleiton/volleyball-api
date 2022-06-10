import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { MelhorPosicaoViewRepository } from './melhor-posicao-view.repository';
import { nomeMelhorPontaView } from '../estatistica.constants';
import { MelhorPontaView } from '../entities/melhor-ponta-view.entity';

@EntityRepository(MelhorPontaView)
export class MelhorPontaViewRepository extends MelhorPosicaoViewRepository<MelhorPontaView> {
  protected readonly name = nomeMelhorPontaView;
  protected readonly concurrently = true;
  protected adicionaOrdenacao(
    qb: SelectQueryBuilder<MelhorPontaView>,
  ): SelectQueryBuilder<MelhorPontaView> {
    return qb
      .addOrderBy('m.acesPorPartida', 'DESC')
      .addOrderBy('m.saquesEfetivos', 'DESC');
  }
}
