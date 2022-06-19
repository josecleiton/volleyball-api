import {
  EntityManager,
  EntityRepository,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { IBuscarConfrontoEquipesEmpatadas } from '../dto/partida-pontuacao.dto';
import {
  IBuscaQuantidadePartidasPorTipoEStatus,
  ListaPartidasDto,
} from '../dto/partida.dto';
import { Partida } from '../entities/partida.entity';
import { StatusPartida } from '../enums/status-partida.enum';

@EntityRepository(Partida)
export class PartidaRepository extends Repository<Partida> {
  aplicaRelacoesDeUmaPartidaCompleta(
    qb: SelectQueryBuilder<Partida>,
  ): SelectQueryBuilder<Partida> {
    return qb
      .innerJoinAndSelect('partidas.visitante', 'visitantes')
      .innerJoinAndSelect('visitantes.equipe', 'equipesVisitantes')
      .innerJoinAndSelect('partidas._mandante', 'mandantes')
      .innerJoinAndSelect('mandantes.equipe', 'equipesMandantes');
  }

  async encontraPartidaCompleta(id: string) {
    const qb = this.createQueryBuilder('partidas');

    this.aplicaRelacoesDeUmaPartidaCompleta(qb).where('partidas.id = :id', {
      id,
    });

    return qb.getOne();
  }

  async listaPartidasOrdenadas(requisicao: ListaPartidasDto) {
    const qb = this.createQueryBuilder('partidas');

    this.aplicaRelacoesDeUmaPartidaCompleta(qb).where(
      'equipesVisitantes.idLiga = :idLiga AND equipesMandantes.idLiga = :idLiga',
      { idLiga: requisicao.idLiga },
    );

    if (requisicao.tipoRodada) {
      qb.andWhere('partidas.tipoDaRodada = :tipoPartida', {
        tipoPartida: requisicao.tipoRodada,
      });
    }

    if (requisicao.limite) {
      qb.limit(requisicao.limite);
    }

    qb.orderBy('partidas.dataCriacao', 'ASC');

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
        INNER JOIN equipes_partidas AS v
        ON
          v.id = p.id_visitante
        INNER JOIN equipes AS ev
        ON
          ev.id = v.id_equipe
          AND ev.id_liga = ?
        WHERE
          p.status = ?
          AND p.id_ganhadora IS NULL
      )
    `,
      [idLiga, StatusPartida.AGENDADA],
    );
  }

  async quantidadeDePartidasPorTipoRodadaEStatus({
    idLiga,
    tiposDeRodada,
    statusAceitos,
  }: IBuscaQuantidadePartidasPorTipoEStatus) {
    const qb = this.createQueryBuilder('p');

    qb.select('p.id')
      .innerJoin('p.visitante', 'v')
      .innerJoin('v.equipe', 'e', 'e.id = v.idEquipe AND e.idLiga = :idLiga', {
        idLiga,
      })
      .where('p.status IN (:...statusAceitos)', { statusAceitos })
      .andWhere('p.tipoDaRodada IN (:...tiposDeRodada)', { tiposDeRodada });

    return qb.getCount();
  }

  async buscarConfrontosDeEquipesEmpatadas(
    idLiga: string,
  ): Promise<IBuscarConfrontoEquipesEmpatadas[]> {
    return this.manager
      .query(
        `
    WITH classificacoes_empatadas AS (
      SELECT
        a.pontuacao AS pontuacao,
        a.id_equipe AS equipe_a,
        b.id_equipe AS equipe_b,
      FROM pontuacoes_view AS a
      INNER JOIN equipes AS e
      ON
        e.id = a.id_equipe 
        AND e.id_liga = ?
      INNER JOIN pontuacoes_view AS b
      ON
        a.id <> b.id
        AND a.pontuacao = b.pontuacao
    )

    SELECT
      p.id AS id,
      p.id_ganhadora AS "idGanhadora",
      classificacoes_empatadas.equipe_a AS "idEquipeA",
      classificacoes_empatadas.equipe_b AS "idEquipeB"
    FROM pontuacoes_view AS pv
    INNER JOIN equipes_partida AS ep1
    ON
      ep1.id_equipe = classificacoes_empatadas.equipe_a
    INNER JOIN equipes_partida AS ep2
    ON
      ep2.id_equipe = classificacoes_empatadas.equipe_b
    INNER JOIN partidas AS p
    ON
      (p.id_mandante = ep1.id OR p.id_mandante = ep2.id)
      AND (p.id_visitante = ep1.id OR p.id_visitante = ep2.id)
  `,
        [idLiga],
      )
      .then((res) => (res?.length ? res : []));
  }
}
