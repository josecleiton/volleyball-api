import { CustomRepository } from 'src/modules/core';
import { Repository } from 'typeorm';
import { ListaAtletaDto } from '../dto';
import { Atleta } from '../entities';

@CustomRepository(Atleta)
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
