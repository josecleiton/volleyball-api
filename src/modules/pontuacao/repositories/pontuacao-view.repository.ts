import { CustomRepository, MaterializedViewRepository } from 'src/modules/core';
import { PontuacaoDto } from '../dtos';
import { PontuacaoView } from '../entities';
import { nomePontuacaoView } from '../pontuacao.constant';

@CustomRepository(PontuacaoView)
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
