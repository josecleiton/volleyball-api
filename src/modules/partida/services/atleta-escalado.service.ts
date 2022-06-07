import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AtletaEscaladoComGanhadoraRespostaDto,
  IBuscaAtletaEscalado,
} from '../dto/atleta-escalado.dto';
import { AtletaEscaladoRepository } from '../repositories/atleta-escalado.repository';

@Injectable()
export class AtletaEscaladoService {
  constructor(
    private readonly atletaEscaladoRepository: AtletaEscaladoRepository,
  ) {}

  async encontraParticipacaoComEquipe({
    idAtleta,
    idPartida,
  }: IBuscaAtletaEscalado) {
    const atleta = await this.atletaEscaladoRepository.findOne({
      where: { idAtleta, idPartida },
      relations: ['participacao', 'participacao.equipe'],
    });

    if (!atleta) {
      throw new NotFoundException(
        `Atleta ${idAtleta} não participa da partida ${idPartida}`,
      );
    }

    return new AtletaEscaladoComGanhadoraRespostaDto(
      atleta,
      atleta.participacao.equipe,
    );
  }
}
