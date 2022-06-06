import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import {
  IBuscaQuantidadePartidasPorTipoEStatus,
  ListaPartidasDto,
} from '../dto/partida.dto';
import { Partida } from '../entities/partida.entity';
import { StatusPartida } from '../enums/status-partida.enum';

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

  async removePartidasSemGanhadores(idLiga: string, manager: EntityManager) {
    return manager.query(
      `
      DELETE
      FROM partidas
      WHERE partidas.id = IN (
        SELECT p.id AS id
        FROM partidas AS p
        INNER JOIN equipes AS m
        ON
          m.id = p.id_mandante
          AND m.id_liga = ?
        INNER JOIN equipes AS v
        ON
          v.id = p.id_visitante
          AND v.id_liga = ?
        WHERE
          p.status = ?
          AND p.id_equipe_ganhadora IS NULL
      )
    `,
      [idLiga, idLiga, StatusPartida.AGENDADA],
    );
  }

  async quantidadeDePartidasPorTipoRodadaEStatus({
    idLiga,
    tiposDeRodada,
    statusAceitos,
  }: IBuscaQuantidadePartidasPorTipoEStatus) {
    const qb = this.createQueryBuilder('p');

    qb.select('p.id')
      .innerJoin(
        Equipe,
        'v',
        'v.id = p.equipeVisitante AND v.idLiga = :idLiga',
        { idLiga },
      )
      .where('p.status IN (:...statusAceitos)', { statusAceitos })
      .andWhere('p.tipoDaRodada IN (:...tiposDeRodada)', { tiposDeRodada });

    return qb.getCount();
  }
}
