import { Injectable } from '@nestjs/common';
import { MelhorLiberoRespostaDto } from '../dto/melhor-libero.dto';
import { IMelhorPosicaoService } from '../interfaces/melhor-posicao-service.interface';
import { MelhorLiberoViewRepository } from '../repositories';

@Injectable()
export class MelhorLiberoService
  implements IMelhorPosicaoService<MelhorLiberoRespostaDto>
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
