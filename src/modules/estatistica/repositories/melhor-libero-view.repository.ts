import { CustomRepository } from 'src/modules/core';
import { SelectQueryBuilder } from 'typeorm';
import { MelhorLiberoView } from '../entities';
import { nomeMelhorLiberoView } from '../estatistica.constants';
import { MelhorPosicaoViewRepository } from './melhor-posicao-view.repository';

@CustomRepository(MelhorLiberoView)
export class MelhorLiberoViewRepository extends MelhorPosicaoViewRepository<MelhorLiberoView> {
  protected readonly name = nomeMelhorLiberoView;
  protected readonly concurrently = true;
  protected adicionaOrdenacao(
    qb: SelectQueryBuilder<MelhorLiberoView>,
  ): SelectQueryBuilder<MelhorLiberoView> {
    return qb.addOrderBy('m.recepcoesPorPartida', 'DESC');
  }
}
