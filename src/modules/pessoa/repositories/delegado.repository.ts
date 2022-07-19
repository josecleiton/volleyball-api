import { CustomRepository } from 'src/modules/core';
import { Repository } from 'typeorm';
import { Delegado } from '../entities';

@CustomRepository(Delegado)
export class DelegadoRepository extends Repository<Delegado> {}
