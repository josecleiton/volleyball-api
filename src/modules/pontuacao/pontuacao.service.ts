import { Injectable } from '@nestjs/common';
import { Liga } from '../liga/entities/liga.entity';
import { PontuacaoRespostaDto } from './dtos/pontuacao.dto';
import { PontuacaoViewRepository } from './repositories/pontuacao-view.repository';

@Injectable()
export class PontuacaoService {
  constructor(private readonly pontuacaoRepository: PontuacaoViewRepository) {}

  async listaPontuacoesOrdenadas(
    idLiga: string,
    limite = Liga.minimoDeEquipesNaLiga,
  ): Promise<PontuacaoRespostaDto[]> {
    const pontuacoes = await this.pontuacaoRepository.listaPorLiga(
      idLiga,
      Liga.minimoDeEquipesNaLiga,
    );

    // odernar por pontuação 
    pontuacoes.sort((a,b)=> a.pontuacao > b.pontuacao ? -1:1)
    // TODO: critério de desempate

    return pontuacoes.map((x) => new PontuacaoRespostaDto(x)).slice(0, limite);
  }
}