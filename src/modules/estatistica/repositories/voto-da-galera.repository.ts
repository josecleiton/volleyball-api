import { EntityRepository, Repository } from 'typeorm';
import { VotoDaGalera } from '../entities/voto-da-galera.entity';

@EntityRepository(VotoDaGalera)
export class VotoDaGaleraRepository extends Repository<VotoDaGalera> {
  async jaVotouNaLiga(telefone: string, idLiga: string) {
    const qb = this.createQueryBuilder('voto');

    qb.select('voto.id', 'id')
      .innerJoin('voto.atleta', 'a')
      .innerJoin('a.equipe', 'e')
      .where('voto.telefone = :telefone', { telefone })
      .andWhere('e.idLiga = :idLiga', { idLiga })
      .limit(1);

    return qb.getOne().then((x) => Boolean(x));
  }
}
