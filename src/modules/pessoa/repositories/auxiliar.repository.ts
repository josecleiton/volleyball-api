import { CustomRepository } from 'src/modules/core';
import { Repository } from 'typeorm';
import { Auxiliar } from '../entities';

@CustomRepository(Auxiliar)
export class AuxiliarRepository extends Repository<Auxiliar> {}
