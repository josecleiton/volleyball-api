import { MaterializedViewRepository } from 'src/modules/core/repositories/materialized-view.repository';
import { EntityRepository } from 'typeorm';
import { PontuacaoView } from '../entities/pontuacao-view.entity';
import { nomePontuacaoView } from '../pontuacao.constant';

@EntityRepository(PontuacaoView)
export class PontuacaoViewRepository extends MaterializedViewRepository<PontuacaoView> {
  protected readonly name = nomePontuacaoView;
  protected readonly concurrently = true;

  async listaPorLiga(idLiga: string, limite: number) {
    const qb = this.createQueryBuilder('p');

    qb.innerJoinAndSelect('p.equipe', 'equipes')
      .where('equipes.idLiga = :idLiga', { idLiga })
      .limit(limite);

    return qb.getMany();
  }
}
