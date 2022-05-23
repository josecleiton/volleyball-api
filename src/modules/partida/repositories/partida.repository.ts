import { EntityRepository, Repository } from 'typeorm';
import { Partida } from '../entities/partida.entity';

@EntityRepository(Partida)
export class PartidaRepository extends Repository<Partida> {}
