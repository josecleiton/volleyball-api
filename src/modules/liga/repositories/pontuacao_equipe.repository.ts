import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import {
  IListaPontuacaoDaLigaOrdenadaResposta,
  IPontuacaoDto,
} from '../dto/pontuacao_equipe.dto';
import { PontuacaoEquipe } from '../entities/pontuacao_equipe.entity';

@EntityRepository(PontuacaoEquipe)
export class PontuacaoEquipeRepository extends Repository<PontuacaoEquipe> {
  async atualizaPontuacao(
    id: string,
    pontos: number,
    manager: EntityManager,
  ): Promise<IPontuacaoDto> {
    const result: IPontuacaoDto[] = await manager.query(
      `
      UPDATE pontuacoes_equipe
      SET
        pontuacao = pontuacao + ?
      WHERE
        id = ?
      RETURNING *
      `,
      [pontos, id],
    );

    if (!result?.length) {
      throw new Error(`Tabela ${id} não encontrada`);
    }

    return result[0];
  }

  async listaPontuacaoOrdenadaPorLiga(idLiga: string, limite = 12) {
    const qb = this.createQueryBuilder('pontuacoes');

    return qb
      .select('pontuacoes.pontuacao', 'pontuacao')
      .addSelect('equipes.id', 'equipeId')
      .addSelect('equipes.nome', 'equipeNome')
      .addSelect('equipes.idGinasio', 'equipeIdGinasio')
      .addSelect('equipes.idLiga', 'ligaId')
      .innerJoin(Equipe, 'equipes', 'equipes.id = pontuacoes.id')
      .where('equipes.id_liga = :idLiga', { idLiga })
      .limit(limite)
      .orderBy({ pontuacao: 'DESC' })
      .getRawMany<IListaPontuacaoDaLigaOrdenadaResposta>();
  }
}
