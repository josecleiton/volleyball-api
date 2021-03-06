import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { groupBy } from 'lodash';
import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { PartidaRespostaDto } from 'src/modules/partida/dto/partida.dto';
import { PartidaFactory } from 'src/modules/partida/factories/partida.factory';
import { PartidaService } from 'src/modules/partida/services/partida.service';
import { TipoRodadaMataMata } from 'src/modules/partida/types/tipo-rodada.type';
import { PontuacaoDto } from 'src/modules/pontuacao/dtos/pontuacao.dto';
import { PontuacaoService } from 'src/modules/pontuacao/services';
import { IClassificados } from '../dto/mata-mata.dto';
import { Liga } from '../entities/liga.entity';
import { MataMataGeneratorService } from './mata-mata-generator.service';

interface IInfoRodada {
  tipo: TipoRodadaMataMata;
  quantidadePartidasAgendadas: number;
}

export abstract class SemisEFinalGeneratorService extends MataMataGeneratorService {
  private static readonly rodadaAnteriorMap: ReadonlyMap<string, IInfoRodada> =
    new Map([
      [
        'semis',
        {
          tipo: 'quartas',
          quantidadePartidasAgendadas:
            MataMataGeneratorService.quantidadeDePartidasNasQuartas,
        },
      ],
      [
        'final',
        {
          tipo: 'semis',
          quantidadePartidasAgendadas:
            MataMataGeneratorService.quantidadeDePartidasNasSemis,
        },
      ],
    ]);
  constructor(
    private readonly partidaService: PartidaService,
    private readonly pontuacaoService: PontuacaoService,
    partidaFactory: PartidaFactory,
  ) {
    super(partidaFactory);
  }

  private listarVencedores(partidas: PartidaRespostaDto[]) {
    const grupo = groupBy(partidas, (partida) => partida.ganhadora?.idEquipe);
    const vencedores = Object.entries(grupo).filter(
      ([ganhador, partidasGanhas]) =>
        isUUID(ganhador) && partidasGanhas.length > 1,
    );

    const quantidadeDeVencedores = this.tipoRodada === 'semis' ? 4 : 2;
    if (vencedores.length !== quantidadeDeVencedores) {
      throw new ConflictException(
        'Algum dos confrontos da rodada anterior n??o foram conclu??dos',
      );
    }

    return vencedores.map(([idGanhador]) => idGanhador);
  }

  // Caso a coloca????o do vencedor da chave a direita seja maior,
  // invertemos a posi????o com a outra equipe para manter a escolha de mando
  // consistente com as regras
  private ordenaVencedorPorClassificacao(
    vencedores: string[],
    pontuacoes: PontuacaoDto[],
  ) {
    const idEquipeClassificacaoMap: ReadonlyMap<string, number> = new Map(
      pontuacoes.map((pontuacao, index) => [pontuacao.equipe.id, index + 1]),
    );

    const resultado = [...vencedores];

    resultado.some((vencedorEsquerda, index, array) => {
      const direitaIndex = array.length - index - 1;
      const vencedorDireita = array[direitaIndex];

      if (
        (idEquipeClassificacaoMap.get(vencedorEsquerda) ?? 0) <
        (idEquipeClassificacaoMap.get(vencedorDireita) ?? 0)
      ) {
        array[index] = vencedorDireita;
        array[direitaIndex] = vencedorEsquerda;
      }

      return index === array.length / 2 - 1;
    });

    return resultado;
  }

  protected async listaClassificados(idLiga: string): Promise<IClassificados> {
    const rodadaAnterior = SemisEFinalGeneratorService.rodadaAnteriorMap.get(
      this.tipoRodada,
    ) as IInfoRodada;

    const partidas = await this.partidaService.listaPartidasOrdenadas({
      idLiga,
      tipoRodada: rodadaAnterior.tipo,
      limite: rodadaAnterior.quantidadePartidasAgendadas,
    });

    if (partidas.length !== rodadaAnterior.quantidadePartidasAgendadas) {
      throw new InternalServerErrorException(
        `N??o foram agendadas ${rodadaAnterior.quantidadePartidasAgendadas} partidas para as quartas de final da liga ${idLiga}`,
      );
    }

    const pontuacoes =
      await this.pontuacaoService.listaPontuacoesOrdenadasEntidades(
        idLiga,
        Liga.quantidadeDeEquipesClassificadas,
      );

    const vencedores = this.listarVencedores(partidas);

    const vencedoresOrdenadosPorClassificacao =
      this.ordenaVencedorPorClassificacao(vencedores, pontuacoes);

    const equipeMap = new Map(
      pontuacoes.map((pontuacao) => [pontuacao.idEquipe, pontuacao.equipe]),
    );

    return {
      equipes: vencedoresOrdenadosPorClassificacao.map(
        (vencedor) => equipeMap.get(vencedor) as Equipe,
      ),
    };
  }
}
