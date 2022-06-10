import { Injectable } from '@nestjs/common';
import { MelhorCentralRespostaDto } from '../dto/melhor-central.dto';
import { IMelhorEstatisticaService } from '../interfaces/melhor-estatistica-service.interface';
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
