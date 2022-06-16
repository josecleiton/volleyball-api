import { EntityRepository, Repository } from 'typeorm';
import { ListaAtletaDto } from '../dto/atleta.dto';
import { Atleta } from '../entities/atleta.entity';

@EntityRepository(Atleta)
export class AtletaRepository extends Repository<Atleta> {
  async listaAtletas({ idEquipe, ids }: ListaAtletaDto): Promise<Atleta[]> {
    const qb = this.createQueryBuilder('atletas');

    qb.innerJoinAndSelect('atletas.pessoa', 'pessoa').where(
      'atletas.idEquipe = :idEquipe',
      { idEquipe },
    );

    if (ids) {
      qb.andWhereInIds(ids);
    }

    qb.orderBy('atletas.dataCriacao', 'ASC');

    return qb.getMany();
  }
}
