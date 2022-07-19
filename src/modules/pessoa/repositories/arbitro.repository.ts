import { CustomRepository } from 'src/modules/core';
import { Repository } from 'typeorm';
import { Arbitro } from '../entities';

@CustomRepository(Arbitro)
export class ArbitroRepository extends Repository<Arbitro> {}
