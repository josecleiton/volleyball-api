import { ConflictException, Injectable, Scope } from '@nestjs/common';
import { PontuacaoEquipeService } from '../services/pontuacao-equipe.service';
import { MataMataGeneratorService } from './mata-mata-generator.service';
import { IClassificados } from '../dto/mata-mata.dto';
import { Liga } from '../entities/liga.entity';

@Injectable({ scope: Scope.TRANSIENT })
export class QuartaDeFinalGeneratorService extends MataMataGeneratorService {
  constructor(private readonly pontuacaoEquipeService: PontuacaoEquipeService) {
    super();
  }

  protected readonly tipoRodada = 'quartas';
  protected async listaClassificados(idLiga: string): Promise<IClassificados> {
    const pontuacoes =
      await this.pontuacaoEquipeService.listaPontuacoesOrdenadas(
        idLiga,
        Liga.quantidadeDeEquipesClassificadas,
      );
    if (pontuacoes.length !== Liga.quantidadeDeEquipesClassificadas) {
      throw new ConflictException(
        `É preciso ${Liga.quantidadeDeEquipesClassificadas} equipes com pontuações para gerar quartas`,
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
