import { CustomRepository } from 'src/modules/core/typeorm-ex';
import { Repository } from 'typeorm';
import { EquipePartida } from '../entities/equipe-partida.entity';

@CustomRepository(EquipePartida)
export class EquipePartidaRepository extends Repository<EquipePartida> {}
