import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { ListaPartidasDto } from '../dto/partida.dto';
import { Partida } from '../entities/partida.entity';
import { PartidaStatus } from '../enums/partida-status.enum';

@EntityRepository(Partida)
export class PartidaRepository extends Repository<Partida> {
  async listaPartidasOrdenadas(requisicao: ListaPartidasDto) {
    const qb = this.createQueryBuilder('partidas');

    qb.innerJoinAndSelect(
      'partidas.equipeGanhadora',
      'equipesG',
      'equipesG.id = partidas.idEquipeGanhadora AND equipesG.idLiga = :idLiga',
      { idLiga: requisicao.idLiga },
    );

    if (requisicao.tipoPartida) {
      qb.andWhere('partidas.tipoPartida = :tipoPartida', {
        tipoPartida: requisicao.tipoPartida,
      });
    }

    if (requisicao.limite) {
      qb.limit(requisicao.limite);
    }

    return qb.getMany();
  }

  async removePartidasSemGanhadores(
    id: string,
    tipo: 'semis' | 'quartas' | 'final',
    manager: EntityManager,
  ) {
    return manager.query(
      `
      DELETE
      FROM partidas
      WHERE partidas.id = IN (
        SELECT p.id AS id
        FROM p
        INNER JOIN equipes AS mandantes
        ON
          mandantes.id = p.id_mandante
          AND mandantes.id_liga = ?
        INNER JOIN equipes AS visitantes
        ON
          visitantes.id = p.id_visitante
          AND visitantes.id_liga = ?
        WHERE
          p.status = ?
          AND p.tipoRodada = ?
          AND p.id_equipe_ganhadora IS NULL
      )
    `,
      [id, id, PartidaStatus.AGENDADA, tipo],
    );
  }
}
