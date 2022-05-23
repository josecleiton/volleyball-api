import { EntityRepository, Repository } from 'typeorm';
import { Delegado } from '../entities/delegado.entity';

@EntityRepository(Delegado)
export class DelegadoRepository extends Repository<Delegado> {}
