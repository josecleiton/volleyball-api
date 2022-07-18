import { CustomRepository } from 'src/modules/core/typeorm-ex';
import { Repository } from 'typeorm';
import {
  IFundamentoAtletaLiga,
  ListaFundamentoNaLigaDto,
} from '../dto/fundamento-atleta.dto';
import { FundamentoAtleta } from '../entities/fundamento-atleta.entity';

@CustomRepository(FundamentoAtleta)
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

  async listaFundamentosNaLiga({ idLiga }: ListaFundamentoNaLigaDto) {
    const qb = this.createQueryBuilder('f');

    qb.select('SUM(f.bloqueios)', 'bloqueios')
      .addSelect('SUM(f.recepcoes)', 'recepcoes')
      .addSelect('SUM(f.aces)', 'aces')
      .addSelect('SUM(f.saques)', 'saques')
      .addSelect('SUM(ataques)', 'ataques')
      .addSelect('SUM(pontos)', 'pontos')
      .addSelect('SUM(levantamentos)', 'levantamentos')
      .addSelect('SUM(assistencias)', 'assistencias')
      .addSelect('a.id', 'idAtleta')
      .addSelect('a.numero', 'numeroAtleta')
      .addSelect('p.nome', 'nomeAtleta')
      .addSelect('e.id', 'idEquipe')
      .addSelect('e.nome', 'nomeEquipe')
      .innerJoin('f.atleta', 'ae')
      .innerJoin('ae.participacao', 'ep')
      .innerJoin('ae.atleta', 'a')
      .innerJoin('a.pessoa', 'p')
      .innerJoin('a.equipe', 'e')
      .where('e.idLiga = :idLiga', { idLiga })
      .groupBy('a.id')
      .addGroupBy('p.id')
      .addGroupBy('e.id')
      .addGroupBy('a.numero')
      .addGroupBy('p.nome')
      .addGroupBy('e.nome')
      .orderBy('COUNT(f.id)', 'DESC');

    return qb.getRawMany<IFundamentoAtletaLiga>();
  }
}
