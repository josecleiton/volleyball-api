import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import {
  IListaTabelaOrdenadaPorEquipeResposta,
  ITabelaDto,
} from '../dto/tabela.dto';
import { Tabela } from '../entities/tabela.entity';

@EntityRepository(Tabela)
export class TabelaRepository extends Repository<Tabela> {
  async atualizaTabela(
    id: string,
    pontos: number,
    manager: EntityManager,
  ): Promise<ITabelaDto> {
    const result: ITabelaDto[] = await manager.query(
      `
      UPDATE tabelas
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

  async listaTabelaOrdenadaPorLiga(idLiga: string, limite = 12) {
    const qb = this.createQueryBuilder('tabelas');

    return qb
      .select('tabelas.pontuacao', 'pontuacao')
      .addSelect('equipes.id', 'equipeId')
      .addSelect('equipes.nome', 'equipeNome')
      .addSelect('equipes.idGinasio', 'equipeIdGinasio')
      .addSelect('equipes.idLiga', 'ligaId')
      .innerJoin(Equipe, 'equipes', 'equipes.id = tabelas.id')
      .where('equipes.id_liga = :idLiga', { idLiga })
      .limit(limite)
      .orderBy({ pontuacao: 'DESC' })
      .getRawMany<IListaTabelaOrdenadaPorEquipeResposta>();
  }
}
