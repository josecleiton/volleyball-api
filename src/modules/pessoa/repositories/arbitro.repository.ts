import { CustomRepository } from 'src/modules/core/typeorm-ex';
import { Repository } from 'typeorm';
import { Arbitro } from '../entities/arbitro.entity';

@CustomRepository(Arbitro)
export class ArbitroRepository extends Repository<Arbitro> {}
