import { Injectable } from '@nestjs/common';
import { MelhorLiberoRespostaDto } from '../dto';
import { IMelhorEstatisticaService } from '../interfaces';
import { MelhorLiberoViewRepository } from '../repositories';

@Injectable()
export class MelhorLiberoService
  implements IMelhorEstatisticaService<MelhorLiberoRespostaDto>
{
  constructor(private readonly liberoRepository: MelhorLiberoViewRepository) {}

  async listaMelhoresDaLiga(
    idLiga: string,
  ): Promise<MelhorLiberoRespostaDto[]> {
    const melhoresLiberos = await this.liberoRepository.listaMelhoresDaLiga(
      idLiga,
    );

    return melhoresLiberos.map((x) => new MelhorLiberoRespostaDto(x));
  }
}
