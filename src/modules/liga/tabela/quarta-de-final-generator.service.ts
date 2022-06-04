import { ConflictException, Injectable, Scope } from '@nestjs/common';
import { PontuacaoEquipeService } from '../services/pontuacao-equipe.service';
import { MataMataGeneratorService } from './mata-mata-generator.service';
import { IClassificados } from '../dto/mata-mata.dto';

@Injectable({ scope: Scope.TRANSIENT })
export class QuartaDeFinalGeneratorService extends MataMataGeneratorService {
  private static readonly quantidadeDePontuacoes = 8;
  constructor(private readonly pontuacaoEquipeService: PontuacaoEquipeService) {
    super();
  }

  protected readonly tipoRodada = 'quartas';
  protected async listaClassificados(idLiga: string): Promise<IClassificados> {
    const pontuacoes =
      await this.pontuacaoEquipeService.listaPontuacoesOrdenadas(
        idLiga,
        QuartaDeFinalGeneratorService.quantidadeDePontuacoes,
      );
    if (
      pontuacoes.length !== QuartaDeFinalGeneratorService.quantidadeDePontuacoes
    ) {
      throw new ConflictException(
        `É preciso ${QuartaDeFinalGeneratorService.quantidadeDePontuacoes} equipes com pontuações para gerar quartas`,
      );
    }
    return {
      equipes: pontuacoes.map(({ equipe: { id, idGinasio } }) => ({
        id,
        idGinasio,
      })),
    };
  }
}
