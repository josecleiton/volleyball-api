import { EntityRepository, Repository } from 'typeorm';
import { Atleta } from '../entities/atleta.entity';

@EntityRepository(Atleta)
export class AtletaRepository extends Repository<Atleta> {}
