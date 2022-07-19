import { CustomRepository } from 'src/modules/core';
import { Repository } from 'typeorm';
import { EquipePartida } from '../entities';

@CustomRepository(EquipePartida)
export class EquipePartidaRepository extends Repository<EquipePartida> {}
