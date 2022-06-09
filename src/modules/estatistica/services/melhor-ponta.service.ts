import { Injectable } from '@nestjs/common';
import { MelhorPontaRespostaDto } from '../dto/melhor-ponta.dto';
import { IMelhorPosicaoService } from '../interfaces/melhor-posicao-service.interface';
import { MelhorPontaViewRepository } from '../repositories';

@Injectable()
export class MelhorPontaService
  implements IMelhorPosicaoService<MelhorPontaRespostaDto>
{
  constructor(private readonly pontaRepository: MelhorPontaViewRepository) {}

  async listaMelhoresDaLiga(idLiga: string): Promise<MelhorPontaRespostaDto[]> {
    const pontas = await this.pontaRepository.listaMelhoresDaLiga(idLiga);

    return pontas.map((x) => new MelhorPontaRespostaDto(x));
  }
}
