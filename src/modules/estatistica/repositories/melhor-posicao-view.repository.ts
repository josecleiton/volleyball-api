import { MaterializedViewRepository } from 'src/modules/core/repositories/materialized-view.repository';
import { SelectQueryBuilder } from 'typeorm';

export abstract class MelhorPosicaoViewRepository<
  T,
> extends MaterializedViewRepository<T> {
  protected abstract adicionaOrdenacao(
    qb: SelectQueryBuilder<T>,
  ): SelectQueryBuilder<T>;

  async listaMelhoresDaLiga(idLiga: string, limite = 10) {
    const qb = this.createQueryBuilder('m');

    this.adicionaOrdenacao(
      qb
        .innerJoinAndSelect('m.atleta', 'a')
        .innerJoinAndSelect('a.equipe', 'e')
        .where('e.idLiga = :idLiga', { idLiga })
        .orderBy('m.quantidadePartidas', 'DESC'),
    ).limit(limite);

    return qb.getMany();
  }
}
