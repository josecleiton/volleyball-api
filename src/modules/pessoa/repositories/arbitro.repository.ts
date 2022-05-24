import { EntityRepository, Repository } from 'typeorm';
import { Arbitro } from '../entities/arbitro.entity';

@EntityRepository(Arbitro)
export class ArbitroRepository extends Repository<Arbitro> {}
