import { Injectable } from '@nestjs/common';
import { MelhorCentralRespostaDto } from '../dto/melhor-central.dto';
import { IMelhorPosicaoService } from '../interfaces/melhor-posicao-service.interface';
import { MelhorCentralViewRepository } from '../repositories';

@Injectable()
export class MelhorCentralService
  implements IMelhorPosicaoService<MelhorCentralRespostaDto>
{
  constructor(
    private readonly centralRepository: MelhorCentralViewRepository,
  ) {}
  async listaMelhoresDaLiga(
    idLiga: string,
  ): Promise<MelhorCentralRespostaDto[]> {
    const centrais = await this.centralRepository.listaMelhoresDaLiga(idLiga);

    return centrais.map((x) => new MelhorCentralRespostaDto(x));
  }
}
