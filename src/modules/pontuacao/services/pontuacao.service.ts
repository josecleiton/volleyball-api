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
