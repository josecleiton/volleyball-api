import { EntityRepository, Repository } from 'typeorm';
import { AtletaEscalado } from '../entities/atleta-escalado.entity';

@EntityRepository(AtletaEscalado)
export class AtletaEscaladoRepository extends Repository<AtletaEscalado> {}
