import { Injectable } from '@nestjs/common';
import { Liga } from 'src/modules/liga';
import { tiposDeRodadaClassificatoria, TipoRodada } from 'src/modules/partida';
import { PontuacaoRespostaDto } from '../dtos';
import { PontuacaoViewRepository } from '../repositories';
import { AplicaRegraDesempateService } from './aplica-regra-desempate.service';

@Injectable()
export class PontuacaoService {
  private static readonly conjuntoDeRodadasClassificatórias: ReadonlySet<string> =
    new Set(tiposDeRodadaClassificatoria);
  constructor(
    private readonly pontuacaoRepository: PontuacaoViewRepository,
    private readonly aplicaRegraDesempateService: AplicaRegraDesempateService,
  ) {}

  async listaPontuacoesOrdenadas(
    idLiga: string,
    limite = Liga.quantidadeDeEquipesNaLiga,
  ): Promise<PontuacaoRespostaDto[]> {
    return this.listaPontuacoesOrdenadasEntidades(idLiga, limite).then(
      (pontuacoes) => pontuacoes.map((x) => new PontuacaoRespostaDto(x)),
    );
  }

  async listaPontuacoesOrdenadasEntidades(
    idLiga: string,
    limite = Liga.quantidadeDeEquipesNaLiga,
  ) {
    const pontuacoes = await this.pontuacaoRepository.listaPorLiga(idLiga);

    const classificacoes =
      await this.aplicaRegraDesempateService.buscarEmpateNaPontuacao({
        idLiga,
        classificacoes: pontuacoes,
      });

    return classificacoes.slice(0, limite);
  }

  async atualizaPontuacoes(partida: { tipoDaRodada: TipoRodada }) {
    if (
      !PontuacaoService.conjuntoDeRodadasClassificatórias.has(
        partida.tipoDaRodada,
      )
    ) {
      return;
    }

    await this.pontuacaoRepository.refreshMaterializedView();
  }
}
