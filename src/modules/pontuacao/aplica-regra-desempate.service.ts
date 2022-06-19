import { Injectable } from '@nestjs/common';
import { DirectedGraph } from 'datastructures-js';
import { IBuscarConfrontoEquipesEmpatadas } from '../partida/dto/partida-pontuacao.dto';
import { PartidaRepository } from '../partida/repositories';
import { IAplicaRegraDesempateDto } from './dtos/desempate.dto';

@Injectable()
export class AplicaRegraDesempateService {
  constructor(private readonly partidaRepository: PartidaRepository) {}

  async buscarEmpateNaPontuacao({
    idLiga,
    classificacoes,
  }: IAplicaRegraDesempateDto) {
    const grafoConfrontoDireto = new GrafoDeConfronto(
      await this.partidaRepository.buscarConfrontosDeEquipesEmpatadas(idLiga),
    );

    return classificacoes.sort((a, b) => {
      const fatorVitoria = b.partidasGanhas - a.partidasGanhas;
      if (fatorVitoria) return fatorVitoria;

      const fatorPontuacao = b.pontuacao - a.pontuacao;
      if (fatorPontuacao) return fatorPontuacao;

      const fatorSetsAverage = b.setsAverage - a.setsAverage;
      if (fatorSetsAverage) return fatorSetsAverage;

      const fatorPontosAverage = b.pontosAverage - a.pontosAverage;
      if (fatorPontosAverage) return fatorPontosAverage;

      return -grafoConfrontoDireto.buscaResultadoConfrontoDireto(
        b.idEquipe,
        a.idEquipe,
      );
    });
  }
}

class GrafoDeConfronto {
  private readonly grafo: {
    getWeight(equipeA: string, equipeB: string): number;
  };

  constructor(confrontosDiretos: IBuscarConfrontoEquipesEmpatadas[]) {
    const graphConfrontoDireto = new DirectedGraph<string, unknown>();

    for (const confronto of confrontosDiretos) {
      graphConfrontoDireto
        .addVertex(confronto.idEquipeA, {})
        .addVertex(confronto.idEquipeB, {});

      const pesoEquipeA =
        confronto.idEquipeA === confronto.idGanhadora ? 1 : -1;

      const temConfronto = graphConfrontoDireto.hasEdge(
        confronto.idEquipeA,
        confronto.idEquipeB,
      );
      const pesoAnteriorDaEquipeA = temConfronto
        ? graphConfrontoDireto.getWeight(
            confronto.idEquipeA,
            confronto.idEquipeB,
          )
        : 0;

      graphConfrontoDireto
        .addEdge(
          confronto.idEquipeA,
          confronto.idEquipeB,
          pesoEquipeA + pesoAnteriorDaEquipeA,
        )
        .addEdge(
          confronto.idEquipeB,
          confronto.idEquipeA,
          -pesoEquipeA - pesoAnteriorDaEquipeA,
        );
    }

    this.grafo = graphConfrontoDireto;
  }

  buscaResultadoConfrontoDireto(equipeA: string, equipeB: string) {
    return this.grafo.getWeight(equipeA, equipeB);
  }
}
