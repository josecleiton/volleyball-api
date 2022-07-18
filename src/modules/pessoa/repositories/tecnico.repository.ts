import { CustomRepository } from 'src/modules/core/typeorm-ex';
import { Repository } from 'typeorm';
import { Tecnico } from '../entities/tecnico.entity';

@CustomRepository(Tecnico)
export class TecnicoRepository extends Repository<Tecnico> {}
