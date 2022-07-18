import { MaterializedViewRepository } from 'src/modules/core/repositories/materialized-view.repository';
import { CustomRepository } from 'src/modules/core/typeorm-ex';
import { CraqueDaGaleraView } from '../entities/craque-da-galera-view.entity';
import { nomeCraqueDaGaleraView } from '../estatistica.constants';

@CustomRepository(CraqueDaGaleraView)
export class CraqueDaGaleraViewRepository extends MaterializedViewRepository<CraqueDaGaleraView> {
  protected readonly name = nomeCraqueDaGaleraView;
  protected readonly concurrently = true;

  async listaMelhores(idLiga: string, limite = 5) {
    const qb = this.createQueryBuilder('cg');

    qb.innerJoinAndSelect('cg.atleta', 'a')
      .innerJoinAndSelect('a.pessoa', 'pessoa')
      .innerJoinAndSelect('a.equipe', 'e')
      .where('e.idLiga = :idLiga', { idLiga })
      .orderBy('cg.quantidadeVotos', 'DESC')
      .limit(limite);

    return qb.getMany();
  }
}
