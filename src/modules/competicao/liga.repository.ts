import { EntityRepository, Repository } from 'typeorm';
import { Liga } from './entities/liga.entity';

@EntityRepository(Liga)
export class LigaRepository extends Repository<Liga> {}
