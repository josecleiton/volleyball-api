import { EntityRepository, Repository } from 'typeorm';
import { PontuacaoPartida } from '../entities/partida-pontuacao.entity';

@EntityRepository(PontuacaoPartida)
export class PontuacaoPartidaRepository extends Repository<PontuacaoPartida> {}
