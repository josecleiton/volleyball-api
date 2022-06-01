import { EntityRepository, Repository } from 'typeorm';
import { ArbitroPartida } from '../entities/arbitro-partida.entity';

@EntityRepository(ArbitroPartida)
export class ArbitroPartidaRepository extends Repository<ArbitroPartida> {}
