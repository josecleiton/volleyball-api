import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { ITabelaDto } from '../dto/tabela.dto';
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
}
