import { EntityRepository, Repository } from 'typeorm';
import { Tecnico } from '../entities/tecnico.entity';

@EntityRepository(Tecnico)
export class TecnicoRepository extends Repository<Tecnico> {}
