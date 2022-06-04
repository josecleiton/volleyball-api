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
    const qb = manager.createQueryBuilder().delete().from(Partida);

    return qb
      .where('partidas.status = :status', { status: PartidaStatus.AGENDADA })
      .andWhere('partidas.tipoDaRodada = :tipo', { tipo })
      .andWhere('partidas.idEquipeGanhadora IS NULL');

    return qb.execute();
  }
}
