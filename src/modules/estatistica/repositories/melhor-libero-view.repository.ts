import { EntityRepository } from 'typeorm';
import { MelhorLiberoView } from '../entities/melhor-libero-view.entity';
import { MelhorPosicaoViewRepository } from './melhor-posicao-view.repository';
import { nomeMelhorLiberoView } from '../estatistica.constants';

@EntityRepository(MelhorLiberoView)
export class MelhorLiberoViewRepository extends MelhorPosicaoViewRepository<MelhorLiberoView> {
  protected readonly name = nomeMelhorLiberoView;
  protected readonly concurrently = true;
}
