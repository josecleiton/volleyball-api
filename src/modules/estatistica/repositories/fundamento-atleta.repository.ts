import { EntityRepository, Repository } from 'typeorm';
import { FundamentoAtleta } from '../entities/fundamento-atleta.entity';

@EntityRepository(FundamentoAtleta)
export class FundamentoAtletaRepository extends Repository<FundamentoAtleta> {}
