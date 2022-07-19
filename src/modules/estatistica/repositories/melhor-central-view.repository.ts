import { CustomRepository } from 'src/modules/core';
import { SelectQueryBuilder } from 'typeorm';
import { MelhorCentralView } from '../entities';
import { nomeMelhorCentralView } from '../estatistica.constants';
import { MelhorPosicaoViewRepository } from './melhor-posicao-view.repository';

@CustomRepository(MelhorCentralView)
export class MelhorCentralViewRepository extends MelhorPosicaoViewRepository<MelhorCentralView> {
  protected readonly name = nomeMelhorCentralView;
  protected readonly concurrently = true;

  protected adicionaOrdenacao(
    qb: SelectQueryBuilder<MelhorCentralView>,
  ): SelectQueryBuilder<MelhorCentralView> {
    return qb.addOrderBy('m.bloqueiosPorPartida', 'DESC');
  }
}
