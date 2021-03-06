import { Injectable } from '@nestjs/common';
import { MelhorPontaRespostaDto } from '../dto/melhor-ponta.dto';
import { IMelhorEstatisticaService } from '../interfaces/melhor-estatistica-service.interface';
import { MelhorOpostoViewRepository } from '../repositories';

@Injectable()
export class MelhorOpostoService
  implements IMelhorEstatisticaService<MelhorPontaRespostaDto>
{
  constructor(private readonly opostoRepository: MelhorOpostoViewRepository) {}

  async listaMelhoresDaLiga(idLiga: string): Promise<MelhorPontaRespostaDto[]> {
    const opostos = await this.opostoRepository.listaMelhoresDaLiga(idLiga);

    return opostos.map((x) => new MelhorPontaRespostaDto(x));
  }
}
