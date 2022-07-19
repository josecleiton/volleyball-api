import { CustomRepository } from 'src/modules/core';
import { Repository } from 'typeorm';
import { ArbitroPartida } from '../entities';

@CustomRepository(ArbitroPartida)
export class ArbitroPartidaRepository extends Repository<ArbitroPartida> {}
