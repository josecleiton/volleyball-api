import { Injectable } from '@nestjs/common';
import { DirectedGraph } from 'datastructures-js';
import { compareAsc } from 'date-fns';
import {
  PartidaRepository,
  IBuscarConfrontoEquipesEmpatadas,
} from 'src/modules/partida';
import { IAplicaRegraDesempateDto } from '../dtos';

@Injectable()
export class AplicaRegraDesempateService {
  constructor(private readonly partidaRepository: PartidaRepository) {}

  async buscarEmpateNaPontuacao({
    idLiga,
    classificacoes,
  }: IAplicaRegraDesempateDto) {
    const confrontos =
      await this.partidaRepository.buscarConfrontosDeEquipesEmpatadas(idLiga);
    const grafoConfrontoDireto = new GrafoDeConfronto(confrontos);

    return classificacoes.sort((a, b) => {
      const fatorVitoria = b.partidasGanhas - a.partidasGanhas;
      if (fatorVitoria) {
        return fatorVitoria;
      }

      const fatorPontuacao = b.pontuacao - a.pontuacao;
      if (fatorPontuacao) {
        return fatorPontuacao;
      }

      const fatorSetsAverage = b.setsAverage - a.setsAverage;
      if (fatorSetsAverage) {
        return fatorSetsAverage;
      }

      const fatorPontosAverage = b.pontosAverage - a.pontosAverage;
      if (fatorPontosAverage) {
        return fatorPontosAverage;
      }

      const fatorConfrontoDireto =
        grafoConfrontoDireto.buscaResultadoConfrontoDireto(
          b.idEquipe,
          a.idEquipe,
        );

      if (fatorConfrontoDireto && Number.isFinite(fatorConfrontoDireto)) {
        return -fatorConfrontoDireto;
      }

      return compareAsc(a.equipe.dataCriacao, b.equipe.dataCriacao);
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
        .addVertex(confronto.idEquipeMandante, {})
        .addVertex(confronto.idEquipeVisitante, {});

      const pesoEquipeMandante =
        confronto.idEquipeGanhadora === confronto.idEquipeMandante ? 1 : -1;

      const temConfronto = graphConfrontoDireto.hasEdge(
        confronto.idEquipeMandante,
        confronto.idEquipeVisitante,
      );
      const pesoAnteriorDaEquipeMandante = temConfronto
        ? graphConfrontoDireto.getWeight(
            confronto.idEquipeMandante,
            confronto.idEquipeVisitante,
          )
        : 0;

      graphConfrontoDireto
        .addEdge(
          confronto.idEquipeMandante,
          confronto.idEquipeVisitante,
          pesoEquipeMandante + pesoAnteriorDaEquipeMandante,
        )
        .addEdge(
          confronto.idEquipeVisitante,
          confronto.idEquipeMandante,
          -pesoEquipeMandante - pesoAnteriorDaEquipeMandante,
        );
    }

    this.grafo = graphConfrontoDireto;
  }

  buscaResultadoConfrontoDireto(equipeA: string, equipeB: string) {
    return this.grafo.getWeight(equipeA, equipeB);
  }
}
