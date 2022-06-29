import { EntityRepository, Repository } from 'typeorm';
import { EquipePartida } from '../entities/equipe-partida.entity';

@EntityRepository(EquipePartida)
export class EquipePartidaRepository extends Repository<EquipePartida> {

    
}
