import { Injectable } from '@nestjs/common';
import { MelhorCentralRespostaDto } from '../dto';
import { IMelhorEstatisticaService } from '../interfaces';
import { MelhorCentralViewRepository } from '../repositories';

@Injectable()
export class MelhorCentralService
  implements IMelhorEstatisticaService<MelhorCentralRespostaDto>
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
