import { IBuscarConfrontoEquipes } from 'src/modules/pontuacao/dtos/pontuacao.dto';
import {
  EntityManager,
  EntityRepository,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
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

  async buscarConfrontoEquipes({
    idTime1,
    idTime2,
    tipoRodadas,
  }: IBuscarConfrontoEquipes) {
    const qb = this.createQueryBuilder('p');

    const result = await qb
      .where('p.id_visitante =:idTime1 and p.id_mandante =:idTime2', {
        idTime1,
        idTime2,
      })
      .orWhere('p.id_visitante =:idTime2 and p.id_mandante =:idTime1', {
        idTime1,
        idTime2,
      })
      .andWhere('p.status= :status', { status: 'concluida' })
      .andWhere('p.tipo_da_rodada IN (:...tipoRodadas)', { tipoRodadas })
      .getMany();

    return result;
  }
}
