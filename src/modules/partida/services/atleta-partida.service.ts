import {
  ConflictException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import {
  AtletaPartidaComGanhadoraRespostaDto,
  IBuscaAtletaPartida,
} from '../dto/atleta-partida.dto';
import { AtletaPartida } from '../entities/atleta-partida.entity';
import { AtletaPartidaRepository } from '../repositories/atleta-partida.repository';

@Injectable({ scope: Scope.REQUEST })
export class AtletaPartidaService {
  constructor(
    private readonly atletaPartidaRepository: AtletaPartidaRepository,
  ) {}

  private async deveEncontrarParticipacao(atleta: AtletaPartida) {
    if (!atleta.partida.equipeGanhadora) {
      throw new ConflictException(
        `Partida ${atleta.idPartida} não tem equipe ganhadora definida`,
      );
    }

    return new AtletaPartidaComGanhadoraRespostaDto(
      atleta,
      atleta.partida.equipeGanhadora,
    );
  }

  async encontraParticipacaoComGanhadora({
    idAtleta,
    idPartida,
  }: IBuscaAtletaPartida) {
    const atleta = await this.atletaPartidaRepository.findOne({
      where: { idAtleta, idPartida },
      relations: ['partida', 'partida.equipeGanhadora'],
    });

    if (!atleta) {
      throw new NotFoundException(
        `Atleta ${idAtleta} não participa da partida ${idPartida}`,
      );
    }

    return this.deveEncontrarParticipacao(atleta);
  }

  async econtraParticipacaoComEquipeGanhadoraPorId(id: string) {
    const atleta = await this.atletaPartidaRepository.findOne({
      where: { id },
      relations: ['partida', 'partida.equipeGanhadora'],
    });

    if (!atleta) {
      throw new NotFoundException(`Participaçõa ${id} não encontrada`);
    }

    return this.deveEncontrarParticipacao(atleta);
  }
}
