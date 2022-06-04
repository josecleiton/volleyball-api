import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { PontuacaoEquipeRespostaDto } from '../dto/pontuacao_equipe.dto';
import { PontuacaoEquipeRepository } from '../repositories/pontuacao_equipe.repository';

@Injectable({ scope: Scope.REQUEST })
export class PontuacaoEquipeService {
  constructor(
    private readonly pontuacaoEquipeRepository: PontuacaoEquipeRepository,
  ) {}

  async listaPontuacoesOrdenadas(
    idLiga: string,
    limite?: number,
  ): Promise<PontuacaoEquipeRespostaDto[]> {
    const pontuacoes =
      await this.pontuacaoEquipeRepository.listaPontuacaoOrdenadaPorLiga(
        idLiga,
        limite,
      );

    if (!pontuacoes?.length) {
      throw new NotFoundException(
        `Pontuacões para a liga ${idLiga} não foram encontradas`,
      );
    }

    return pontuacoes.map((x) => new PontuacaoEquipeRespostaDto(x));
  }
}
