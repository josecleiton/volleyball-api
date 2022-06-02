import { EntityRepository, Repository } from 'typeorm';
import { Liga } from './entities/liga.entity';

@EntityRepository(Liga)
export class LigaRepository extends Repository<Liga> {
  async encontraUmComEquipesCompletas(id: string) {
    const qb = this.createQueryBuilder('ligas');
    qb.leftJoinAndSelect('ligas.equipes', 'equipes')
      .leftJoinAndSelect('ligas.arbitros', 'arbitros')
      .leftJoinAndSelect('ligas.delegados', 'delegados')
      .leftJoinAndSelect('equipes.atletas', 'atletas')
      .leftJoinAndSelect('equipes.tecnico', 'tecnico')
      .leftJoinAndSelect('equipes.auxiliares', 'auxiliares')
      .where('ligas.id = :id', { id })
      .orderBy('equipes.dataCriacao', 'ASC');

    return qb.getOneOrFail();
  }
}
