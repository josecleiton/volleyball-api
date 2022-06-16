import { EntityRepository, Repository } from 'typeorm';
import { Liga } from '../entities/liga.entity';

@EntityRepository(Liga)
export class LigaRepository extends Repository<Liga> {
  async encontraUmComEquipesCompletas(id: string) {
    const qb = this.createQueryBuilder('l');
    qb.leftJoinAndSelect('l.equipes', 'equipes')
      .leftJoinAndSelect('l.arbitros', 'arbitros')
      .innerJoinAndSelect('arbitros.pessoa', 'arbitroPessoa')
      .leftJoinAndSelect('l.delegados', 'delegados')
      .innerJoinAndSelect('delegados.pessoa', 'delegadoPessoa')
      .leftJoinAndSelect('equipes.atletas', 'atletas')
      .leftJoinAndSelect('equipes.tecnico', 'tecnicos')
      .leftJoinAndSelect('equipes.auxiliares', 'auxiliares')
      .where('l.id = :id', { id })
      .orderBy('equipes.dataCriacao', 'ASC');

    return qb.getOne();
  }
}
