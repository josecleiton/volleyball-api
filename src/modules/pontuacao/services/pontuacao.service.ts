import { Injectable } from '@nestjs/common';
import { Liga } from 'src/modules/liga/entities/liga.entity';
import { PontuacaoRespostaDto } from '../dtos/pontuacao.dto';
import { PontuacaoViewRepository } from '../repositories/pontuacao-view.repository';
import { AplicaRegraDesempateService } from './aplica-regra-desempate.service';

@Injectable()
export class PontuacaoService {
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
}
