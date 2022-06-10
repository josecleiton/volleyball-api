import { MaterializedViewRepository } from 'src/modules/core/repositories/materialized-view.repository';
import { EntityRepository } from 'typeorm';
import { CraqueDaGaleraView } from '../entities/craque-da-galera.entity';
import { nomeCraqueDaGaleraView } from '../estatistica.constants';

@EntityRepository(CraqueDaGaleraView)
export class CraqueDaGaleraViewRepository extends MaterializedViewRepository<CraqueDaGaleraView> {
  protected readonly name = nomeCraqueDaGaleraView;
  protected readonly concurrently = true;

  async listaMelhores(idLiga: string, limite = 5) {
    const qb = this.createQueryBuilder('cg');

    qb.innerJoinAndSelect('cg.atleta', 'a')
      .innerJoinAndSelect('a.equipe', 'e')
      .where('e.idLiga = :idLiga', { idLiga })
      .orderBy('cg.quantidadeVotos', 'DESC')
      .limit(limite);

    return qb.getMany();
  }
}
