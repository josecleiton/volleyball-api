import { EntityRepository, Equal, Repository } from 'typeorm';
import { Liga } from './entities/liga.entity';

@EntityRepository(Liga)
export class LigaRepository extends Repository<Liga> {
  async pegaUmComEquipesCompletas(id: string) {
    const qb = this.createQueryBuilder('ligas');
    qb.leftJoinAndSelect('ligas.equipes', 'equipes')
      .leftJoinAndSelect('equipes.atletas', 'atletas')
      .leftJoinAndSelect('equipes.tecnico', 'tecnico')
      .where('ligas.id', Equal(id)).orderBy("equipes.dataCriacao", "ASC");

    return qb.getOneOrFail();
  }
}
