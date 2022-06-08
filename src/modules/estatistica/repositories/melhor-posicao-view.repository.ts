import { MaterializedViewRepository } from 'src/modules/core/repositories/materialized-view.repository';

export abstract class MelhorPosicaoViewRepository<
  T,
> extends MaterializedViewRepository<T> {
  async listaMelhoresDaLiga(idLiga: string, limite = 10) {
    const qb = this.createQueryBuilder('m');

    qb.innerJoinAndSelect('m.atleta', 'a')
      .innerJoin('a.equipe', 'ae')
      .where('e.idLiga = :idLiga', { idLiga })
      .limit(limite);

    return qb.getMany();
  }
}
