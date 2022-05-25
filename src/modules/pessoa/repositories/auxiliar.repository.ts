import { EntityRepository, Repository } from 'typeorm';
import { Auxiliar } from '../entities/auxiliar.entity';

@EntityRepository(Auxiliar)
export class AuxiliarRepository extends Repository<Auxiliar> {}