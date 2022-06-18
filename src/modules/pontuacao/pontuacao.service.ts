import { Injectable } from '@nestjs/common';
import { Liga } from '../liga/entities/liga.entity';
import { PartidaRepository } from '../partida/repositories';
import { AplicaRegraDesempateHandler } from './aplica-regra-desempate.handler';
import { PontuacaoRespostaDto } from './dtos/pontuacao.dto';
import { PontuacaoViewRepository } from './repositories/pontuacao-view.repository';

@Injectable()
export class PontuacaoService {
  private classificacao: PontuacaoRespostaDto[] = [];
  constructor(
    private readonly pontuacaoRepository: PontuacaoViewRepository,
    private readonly partidaRepository: PartidaRepository,
  ) {}

  async listaPontuacoesOrdenadas(
    idLiga: string,
    limite = 12,
  ): Promise<PontuacaoRespostaDto[]> {
    const pontuacoes = await this.pontuacaoRepository.listaPorLiga(
      idLiga,
      Liga.minimoDeEquipesNaLiga,
    );

    const resultado = pontuacoes
      .sort((a, b) => b.pontuacao - a.pontuacao)
      .map((x) => new PontuacaoRespostaDto(x));

    // odernar por pontuação
    const aplicaDesempate = new AplicaRegraDesempateHandler(
      resultado,
      this.partidaRepository,
    );

    return aplicaDesempate
      .buscarEmpateNaPontuacao()
      .then((res) => res.slice(0, limite));
  }
}
