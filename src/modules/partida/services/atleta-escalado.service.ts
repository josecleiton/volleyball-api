import { Injectable, NotFoundException } from '@nestjs/common';
import { IBuscaAtletaEscalado, AtletaEscaladoRespostaDto } from '../dto';
import { AtletaEscaladoRepository } from '../repositories';

@Injectable()
export class AtletaEscaladoService {
  constructor(
    private readonly atletaEscaladoRepository: AtletaEscaladoRepository,
  ) {}

  async encontraParticipacaoComEquipe(requisicao: IBuscaAtletaEscalado) {
    const atleta =
      await this.atletaEscaladoRepository.encontraParticipacaoComEquipe(
        requisicao,
      );

    if (!atleta) {
      throw new NotFoundException(
        `Atleta ${requisicao.idAtleta} não participa da partida ${requisicao.idPartida}`,
      );
    }

    return new AtletaEscaladoRespostaDto(atleta);
  }
}
