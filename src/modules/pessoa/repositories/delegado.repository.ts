import { CustomRepository } from 'src/modules/core/typeorm-ex';
import { Repository } from 'typeorm';
import { Delegado } from '../entities/delegado.entity';

@CustomRepository(Delegado)
export class DelegadoRepository extends Repository<Delegado> {}
