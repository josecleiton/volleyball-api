import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IPartidaFactoryDto } from '../dto/partida-factory.dto';
import { EquipePartida } from '../entities/equipe-partida.entity';
import { PartidaRepository } from '../repositories';

@Injectable()
export class PartidaFactory {
  constructor(private readonly partidaRepository: PartidaRepository) {}

  instanciaPartida({
    equipeMandante,
    equipeVisitante,
    dataComeco,
    tipoDaRodada,
  }: IPartidaFactoryDto) {
    const equipePartidaMandante = new EquipePartida();
    equipePartidaMandante.id = randomUUID();
    equipePartidaMandante.equipe = equipeMandante;

    const equipePartidaVisitante = new EquipePartida();
    equipePartidaVisitante.id = randomUUID();
    equipePartidaVisitante.equipe = equipeVisitante;

    const partida = this.partidaRepository.create({
      visitante: equipePartidaVisitante,
      dataComeco,
      tipoDaRodada,
    });

    partida.mandante = equipePartidaMandante;

    return partida;
  }
}
