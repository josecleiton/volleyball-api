import { EntityRepository } from 'typeorm';
import { MelhorCentralView } from '../entities/melhor-central-view.entity';
import { MelhorPosicaoViewRepository } from './melhor-posicao-view.repository';
import { nomeMelhorCentralView } from '../estatistica.constants';

@EntityRepository(MelhorCentralView)
export class MelhorCentralViewRepository extends MelhorPosicaoViewRepository<MelhorCentralView> {
  protected readonly name = nomeMelhorCentralView;
  protected readonly concurrently = true;
}
