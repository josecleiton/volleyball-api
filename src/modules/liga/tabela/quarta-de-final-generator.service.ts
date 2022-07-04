import { ConflictException, Injectable } from '@nestjs/common';
import { MataMataGeneratorService } from './mata-mata-generator.service';
import { IClassificados } from '../dto/mata-mata.dto';
import { Liga } from '../entities/liga.entity';
import { PontuacaoService } from 'src/modules/pontuacao/services';
import { PartidaFactory } from 'src/modules/partida/factories/partida.factory';

@Injectable()
export class QuartaDeFinalGeneratorService extends MataMataGeneratorService {
  constructor(
    private readonly pontuacaoService: PontuacaoService,
    partidaFactory: PartidaFactory,
  ) {
    super(partidaFactory);
  }

  protected readonly tipoRodada = 'quartas';
  protected async listaClassificados(idLiga: string): Promise<IClassificados> {
    const pontuacoes =
      await this.pontuacaoService.listaPontuacoesOrdenadasEntidades(
        idLiga,
        Liga.quantidadeDeEquipesClassificadas,
      );
    if (pontuacoes.length !== Liga.quantidadeDeEquipesClassificadas) {
      throw new ConflictException(
        `É preciso ${Liga.quantidadeDeEquipesClassificadas} equipes com pontuações para gerar quartas`,
      );
    }
    return {
      equipes: pontuacoes.map((x) => x.equipe),
    };
  }
}
