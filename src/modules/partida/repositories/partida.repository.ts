import { nomePontuacaoView } from 'src/modules/pontuacao/pontuacao.constant';
import {
  EntityManager,
  EntityRepository,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { IBuscarConfrontoEquipesEmpatadas } from '../dto/partida-pontuacao.dto';
import {
  IBuscaQuantidadePartidasPorTipoEStatus,
  ListaPartidasRepositoryDto,
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
      .leftJoinAndSelect('visitantes.atletas', 'atletasVisitantes')
      .innerJoinAndSelect('partidas._mandante', 'mandantes')
      .innerJoinAndSelect('mandantes.equipe', 'equipesMandantes')
      .leftJoinAndSelect('mandantes.atletas', 'atletasMandantes')
      .leftJoinAndSelect('partidas.ganhadora', 'ganhadoras')
      .leftJoinAndSelect('ganhadoras.equipe', 'equipesGanhadoras')
      .leftJoinAndSelect('ganhadoras.atletas', 'atletasGanhadores');
  }

  async encontraPartidaCompleta(id: string) {
    const qb = this.createQueryBuilder('partidas');

    this.aplicaRelacoesDeUmaPartidaCompleta(qb).where('partidas.id = :id', {
      id,
    });

    return qb.getOne();
  }

  async listaPartidasOrdenadas(requisicao: ListaPartidasRepositoryDto) {
    const qb = this.createQueryBuilder('partidas');

    this.aplicaRelacoesDeUmaPartidaCompleta(qb).where(
      'equipesVisitantes.idLiga = :idLiga',
      { idLiga: requisicao.idLiga },
    );

    if (requisicao.tipoRodada) {
      qb.andWhere('partidas.tipoDaRodada = :tipoPartida', {
        tipoPartida: requisicao.tipoRodada,
      });
    }

    qb.orderBy('partidas.dataCriacao', 'ASC');

    return qb.getMany();
  }

  async removePartidasNaoDisputadas(idLiga: string, manager: EntityManager) {
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
    const qb = this.createQueryBuilder('p');

    qb.select('p.id', 'id')
      .addSelect('eg.id', 'idEquipeGanhadora')
      .addSelect('em.id', 'idEquipeMandante')
      .addSelect('ev.id', 'idEquipeVisitante')
      .innerJoin('p.ganhadora', 'ganhadora')
      .innerJoin('p._mandante', 'mandante')
      .innerJoin('p.visitante', 'visitante')
      .innerJoin('ganhadora.equipe', 'eg')
      .innerJoin('mandante.equipe', 'em')
      .innerJoin('visitante.equipe', 'ev')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('pv.idEquipe')
          .distinct(true)
          .from(nomePontuacaoView, 'pv')
          .innerJoin(
            nomePontuacaoView,
            'pv2',
            'pv2.idEquipe <> pv.idEquipe AND pv2.pontuacao = pv.pontuacao',
          )
          .innerJoin('pv.equipe', 'e', 'e.idLiga = :idLiga')
          .getQuery();

        return `eg.id IN ${subQuery}`;
      })
      .orderBy('p.dataCriacao')
      .setParameter('idLiga', idLiga);

    return qb.getRawMany();
  }
}
