import { Repository } from 'typeorm';
import { CustomRepository } from '../core/typeorm-ex';
import { Equipe } from './entities/equipe.entity';

@CustomRepository(Equipe)
export class EquipeRepository extends Repository<Equipe> {}
