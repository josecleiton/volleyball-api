import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Partida, EquipePartida } from '../entities';

@Injectable()
export class SalvaPartidaFacade {
  async executa(partidas: Partida[], manager: EntityManager) {
    const participacoes = partidas.map((x) => [x.mandante, x.visitante]).flat();

    await manager.insert(EquipePartida, participacoes);

    const partidasSalvas = await manager.save(partidas);

    await manager.save(
      partidas
        .map((x) => {
          x.mandante.idPartida = x.visitante.idPartida = x.id;
          return [x.mandante, x.visitante];
        })
        .flat(),
    );

    return partidasSalvas;
  }
}
