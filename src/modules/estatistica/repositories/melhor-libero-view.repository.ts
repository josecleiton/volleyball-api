import { SelectQueryBuilder } from 'typeorm';
import { MelhorLiberoView } from '../entities/melhor-libero-view.entity';
import { MelhorPosicaoViewRepository } from './melhor-posicao-view.repository';
import { nomeMelhorLiberoView } from '../estatistica.constants';
import { CustomRepository } from 'src/modules/core/typeorm-ex';

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
