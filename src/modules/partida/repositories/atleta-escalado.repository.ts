import { CustomRepository } from 'src/modules/core';
import { Repository } from 'typeorm';
import { IBuscaAtletaEscalado } from '../dto';
import { AtletaEscalado } from '../entities';

@CustomRepository(AtletaEscalado)
export class AtletaEscaladoRepository extends Repository<AtletaEscalado> {
  async encontraParticipacaoComEquipe({
    idAtleta,
    idPartida,
  }: IBuscaAtletaEscalado) {
    const qb = this.createQueryBuilder('ae');

    qb.innerJoinAndSelect(
      'ae.participacao',
      'ep',
      'ep.id = ae.idEquipePartida AND ep.idPartida = :idPartida',
      { idPartida },
    )
      .innerJoinAndSelect('ep.equipe', 'e')
      .where('ae.idAtleta = :idAtleta', { idAtleta });

    return qb.getOne();
  }
}
