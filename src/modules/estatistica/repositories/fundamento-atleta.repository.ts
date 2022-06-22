import { EntityRepository, Repository } from 'typeorm';
import { FundamentoAtleta } from '../entities/fundamento-atleta.entity';

@EntityRepository(FundamentoAtleta)
export class FundamentoAtletaRepository extends Repository<FundamentoAtleta> {
  async listaFundamentoDeAtleta(idAtleta: string) {
    const qb = this.createQueryBuilder('f');

    qb.innerJoinAndSelect('f.atleta', 'ae')
      .innerJoinAndSelect('ae.participacao', 'ep')
      .innerJoinAndSelect('ae.atleta', 'a')
      .innerJoinAndSelect('ep.equipe', 'e')
      .where('a.id = :idAtleta', { idAtleta })
      .orderBy('f.dataCriacao', 'ASC');

    return qb.getMany();
  }
}
