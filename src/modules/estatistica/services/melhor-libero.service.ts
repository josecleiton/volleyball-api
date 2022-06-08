import { Injectable } from '@nestjs/common';
import { MelhorLiberoRespostaDto } from '../dto/melhor-libero.dto';
import { MelhorLiberoViewRepository } from '../repositories';

@Injectable()
export class MelhorLiberoService {
  constructor(private readonly liberoRepository: MelhorLiberoViewRepository) {}

  async listaMelhores(idLiga: string) {
    const melhoresLiberos = await this.liberoRepository.listaMelhores(idLiga);

    return melhoresLiberos.map((x) => new MelhorLiberoRespostaDto(x));
  }
}
