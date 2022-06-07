import { ConflictException, Injectable } from '@nestjs/common';
import { MataMataGeneratorService } from './mata-mata-generator.service';
import { IClassificados } from '../dto/mata-mata.dto';
import { Liga } from '../entities/liga.entity';
import { PontuacaoService } from 'src/modules/pontuacao/pontuacao.service';

@Injectable()
export class QuartaDeFinalGeneratorService extends MataMataGeneratorService {
  constructor(private readonly pontuacaoService: PontuacaoService) {
    super();
  }

  protected readonly tipoRodada = 'quartas';
  protected async listaClassificados(idLiga: string): Promise<IClassificados> {
    const pontuacoes = await this.pontuacaoService.listaPontuacoesOrdenadas(
      idLiga,
      Liga.quantidadeDeEquipesClassificadas,
    );
    if (pontuacoes.length !== Liga.quantidadeDeEquipesClassificadas) {
      throw new ConflictException(
        `É preciso ${Liga.quantidadeDeEquipesClassificadas} para gerar quartas`,
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
