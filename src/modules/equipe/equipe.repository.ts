import { EntityRepository, Repository } from 'typeorm';
import { Equipe } from './entities/equipe.entity';

@EntityRepository(Equipe)
export class EquipeRepository extends Repository<Equipe> {}
