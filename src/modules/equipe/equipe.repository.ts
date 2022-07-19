import { Repository } from 'typeorm';
import { CustomRepository } from '../core';
import { Equipe } from './entities';

@CustomRepository(Equipe)
export class EquipeRepository extends Repository<Equipe> {}
