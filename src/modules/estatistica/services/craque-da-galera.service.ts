import { Injectable } from '@nestjs/common';
import { CraqueDaGaleraRespostaDto } from '../dto/craque-da-galera.dto';
import { IMelhorEstatisticaService } from '../interfaces/melhor-estatistica-service.interface';
import { CraqueDaGaleraViewRepository } from '../repositories';

@Injectable()
export class CraqueDaGaleraService
  implements IMelhorEstatisticaService<CraqueDaGaleraRespostaDto>
{
  constructor(
    private readonly craqueDaGaleraRepository: CraqueDaGaleraViewRepository,
  ) {}

  async listaMelhoresDaLiga(
    idLiga: string,
  ): Promise<CraqueDaGaleraRespostaDto[]> {
    const craques = await this.craqueDaGaleraRepository.listaMelhores(idLiga);

    return craques.map((x) => new CraqueDaGaleraRespostaDto(x));
  }
}
