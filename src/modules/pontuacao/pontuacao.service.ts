import { Injectable } from '@nestjs/common';
import { Liga } from '../liga/entities/liga.entity';
import { AplicaRegraDesempateService } from './aplica-regra-desempate.service';
import { PontuacaoRespostaDto } from './dtos/pontuacao.dto';
import { PontuacaoViewRepository } from './repositories/pontuacao-view.repository';

@Injectable()
export class PontuacaoService {
  private classificacao: PontuacaoRespostaDto[] = [];
  constructor(
    private readonly pontuacaoRepository: PontuacaoViewRepository,
    private readonly aplicaRegraDesempateService: AplicaRegraDesempateService,
  ) {}

  async listaPontuacoesOrdenadas(
    idLiga: string,
    limite = Liga.minimoDeEquipesNaLiga,
  ): Promise<PontuacaoRespostaDto[]> {
    const pontuacoes = await this.pontuacaoRepository.listaPorLiga(
      idLiga,
      Liga.minimoDeEquipesNaLiga,
    );

    const classificacoes = pontuacoes.map((x) => new PontuacaoRespostaDto(x));

    return this.aplicaRegraDesempateService
      .buscarEmpateNaPontuacao({ idLiga, classificacoes })
      .then((res) => res.slice(0, limite));
  }
}
