import { MaterializedViewRepository } from 'src/modules/core/repositories/materialized-view.repository';
import { EntityRepository } from 'typeorm';
import { PontuacaoDto } from '../dtos/pontuacao.dto';
import { PontuacaoView } from '../entities/pontuacao-view.entity';
import { nomePontuacaoView } from '../pontuacao.constant';

@EntityRepository(PontuacaoView)
export class PontuacaoViewRepository extends MaterializedViewRepository<PontuacaoView> {
  protected readonly name = nomePontuacaoView;
  protected readonly concurrently = true;

  async listaPorLiga(idLiga: string) {
    const qb = this.createQueryBuilder('p');

    qb.innerJoinAndSelect('p.equipe', 'e').where('e.idLiga = :idLiga', {
      idLiga,
    });

    return qb.getMany().then((raw) => raw.map((x) => new PontuacaoDto(x)));
  }
}
