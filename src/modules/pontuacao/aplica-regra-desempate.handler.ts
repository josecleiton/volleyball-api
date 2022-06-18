/* eslint-disable no-await-in-loop */
import { PartidaRepository } from '../partida/repositories';
import { tiposDeRodadaClassificatoria } from '../partida/types/tipo-rodada.type';
import {
  IAplicarCriterioDePontuacao,
  IBuscarConfrontoEquipes,
  ITrocarOrdemPontuacoes,
  PontuacaoRespostaDto,
} from './dtos/pontuacao.dto';

export class AplicaRegraDesempateHandler {
  private readonly classificacao: PontuacaoRespostaDto[];
  constructor(
    classificacao: PontuacaoRespostaDto[],
    private readonly partidaRepository: PartidaRepository,
  ) {
    this.classificacao = [...classificacao];
  }

  async buscarEmpateNaPontuacao() {
    const { length } = this.classificacao;
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length; j++) {
        if (
          this.classificacao[i].pontuacao === this.classificacao[j].pontuacao
        ) {
          if (
            this.classificacao[i].partidasGanhas ===
            this.classificacao[j].partidasGanhas
          ) {
            // empate em numero de vitoria
            if (
              this.classificacao[i].setsAverage ===
              this.classificacao[j].setsAverage
            ) {
              // empate em setaverage
              if (
                this.classificacao[i].pontosAverage !==
                this.classificacao[j].pontosAverage
              ) {
                // não teve empate
                this.aplicarCriterioDePontuacao({
                  a: this.classificacao[i].pontosAverage,
                  b: this.classificacao[j].pontosAverage,
                  indexAnterior: i,
                  indexProximo: j,
                });
              }

              // empatou no ultimo criterios, verificar confronto direto

              const verificar = await this.criterioConfrontoDireto({
                idTime1: this.classificacao[i].idEquipe,
                idTime2: this.classificacao[j].idEquipe,
                tipoRodadas: [...tiposDeRodadaClassificatoria],
              });

              // caso seja verdadeira precisa troca a posição dos times

              if (verificar) {
                this.trocarOrdemPontuacoes({
                  indexAnterior: i,
                  indexProximo: j,
                });
              }
            }
            // não teve empate em setAverage
            this.aplicarCriterioDePontuacao({
              a: this.classificacao[i].setsAverage,
              b: this.classificacao[j].setsAverage,
              indexAnterior: i,
              indexProximo: j,
            });
          }
          // não teve empate em numero de vitoria

          this.aplicarCriterioDePontuacao({
            a: this.classificacao[i].partidasGanhas,
            b: this.classificacao[j].partidasGanhas,
            indexAnterior: i,
            indexProximo: j,
          });
        }
      }
    }

    return this.classificacao;
  }

  private aplicarCriterioDePontuacao({
    a,
    b,
    indexAnterior,
    indexProximo,
  }: IAplicarCriterioDePontuacao) {
    if (a > b) {
      this.trocarOrdemPontuacoes({ indexAnterior, indexProximo });
    }
  }

  private trocarOrdemPontuacoes({
    indexAnterior,
    indexProximo,
  }: ITrocarOrdemPontuacoes) {
    const anterior = this.classificacao[indexAnterior];
    const proximo = this.classificacao[indexProximo];
    this.classificacao[indexProximo] = anterior;
    this.classificacao[indexAnterior] = proximo;
  }

  private async criterioConfrontoDireto({
    idTime1,
    idTime2,
    tipoRodadas,
  }: IBuscarConfrontoEquipes) {
    const partidas = await this.partidaRepository.buscarConfrontoEquipes({
      idTime1,
      idTime2,
      tipoRodadas,
    });

    const time1 = partidas.reduce((time1, partida) => {
      if (partida.idGanhadora === idTime1) {
        return time1 + 1;
      }
      return time1;
    }, 0);

    const time2 = partidas.reduce((time2, partida) => {
      if (partida.idGanhadora === idTime2) {
        return time2 + 1;
      }
      return time2;
    }, 0);

    if (time1 === time2) {
      return false;
    }

    return time1 > time2 ? false : true;
  }
}
