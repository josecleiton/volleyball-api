import { CustomRepository } from 'src/modules/core/typeorm-ex';
import { Repository } from 'typeorm';
import { ArbitroPartida } from '../entities/arbitro-partida.entity';

@CustomRepository(ArbitroPartida)
export class ArbitroPartidaRepository extends Repository<ArbitroPartida> {}
