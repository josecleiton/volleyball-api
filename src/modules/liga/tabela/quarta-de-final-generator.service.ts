import { Injectable, ConflictException } from '@nestjs/common';
import { PartidaFactory } from 'src/modules/partida';
import { PontuacaoService } from 'src/modules/pontuacao';
import { IClassificados } from '../dto';
import { Liga } from '../entities';
import { MataMataGeneratorService } from './mata-mata-generator.service';

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
