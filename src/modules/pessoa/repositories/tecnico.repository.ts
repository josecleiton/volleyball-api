import { CustomRepository } from 'src/modules/core';
import { Repository } from 'typeorm';
import { Tecnico } from '../entities';

@CustomRepository(Tecnico)
export class TecnicoRepository extends Repository<Tecnico> {}
