import { EntityRepository, Repository } from 'typeorm';
import { ListaGinasiosDto } from '../dto/ginasio.dto';
import { Ginasio } from '../entities/ginasio.entity';

@EntityRepository(Ginasio)
export class GinasioRepository extends Repository<Ginasio> {
  async listaFiltrando({ cidade, estado, ...requisicao }: ListaGinasiosDto) {
    const qb = this.createQueryBuilder('ginasio');
    if (requisicao.nome) {
      qb.andWhere('ginasio.nome ILIKE :nome', { nome: `${requisicao.nome}%` });
    }

    if (cidade) {
      qb.andWhere('ginasio.cidade = :cidade', { cidade });
    }

    if (estado) {
      qb.andWhere('ginasio.estado = :estado', { estado });
    }

    return qb.getMany();
  }
}
