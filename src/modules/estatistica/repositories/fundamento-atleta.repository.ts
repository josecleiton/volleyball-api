import { plainToClass } from 'class-transformer';
import { EntityRepository, Repository } from 'typeorm';
import {
  FundamentoAgregadoAtletaRespostaDto,
  ListaFundamentoNaLigaDto,
} from '../dto/fundamento-atleta.dto';
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
      .innerJoin('f.atleta', 'ae')
      .innerJoin('ae.participacao', 'ep')
      .innerJoin('ae.atleta', 'a')
      .innerJoin('ep.equipe', 'e')
      .where('e.idLiga = :idLiga', { idLiga })
      .groupBy('a.id')
      .orderBy('COUNT(f.id)', 'DESC');

    return qb
      .getRawMany()
      .then((res) =>
        res.map((x) => plainToClass(FundamentoAgregadoAtletaRespostaDto, x)),
      );
  }
}
