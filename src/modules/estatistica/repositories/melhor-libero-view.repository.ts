import { MaterializedViewRepository } from 'src/modules/core/repositories/materialized-view.repository';
import { EntityRepository } from 'typeorm';
import { MelhorLiberoView } from '../entities/melhor-libero-view.entity';
import { nomeMelhorLiberoView } from '../estatistica.constants';

@EntityRepository(MelhorLiberoView)
export class MelhorLiberoViewRepository extends MaterializedViewRepository<MelhorLiberoView> {
  protected readonly name = nomeMelhorLiberoView;
  protected readonly concurrently = true;

  async listaMelhores(idLiga: string, limite = 10) {
    const qb = this.createQueryBuilder('ml');

    qb.innerJoinAndSelect('ml.atleta', 'a')
      .innerJoin('a.equipe', 'e')
      .where('e.idLiga = :idLiga', { idLiga })
      .limit(limite);

    return qb.getMany();
  }
}
