import { EntityRepository, Repository } from 'typeorm';
import { AtletaPartida } from '../entities/atleta-partida.entity';

@EntityRepository(AtletaPartida)
export class AtletaPartidaRepository extends Repository<AtletaPartida> {}
