import { EntityRepository, Repository } from 'typeorm';
import { IBuscaAtletaEscalado } from '../dto/atleta-escalado.dto';
import { AtletaEscalado } from '../entities/atleta-escalado.entity';

@EntityRepository(AtletaEscalado)
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
