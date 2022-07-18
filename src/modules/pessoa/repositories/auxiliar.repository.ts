import { CustomRepository } from 'src/modules/core/typeorm-ex';
import { Repository } from 'typeorm';
import { Auxiliar } from '../entities/auxiliar.entity';

@CustomRepository(Auxiliar)
export class AuxiliarRepository extends Repository<Auxiliar> {}
