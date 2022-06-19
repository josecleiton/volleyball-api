import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { chunk, countBy } from 'lodash';
import {
  EquipeRespostaDto,
  EquipeSimplificadaRespostaDto,
} from 'src/modules/equipe/dto/equipe.dto';
import { EquipePartidaRespostaDto } from 'src/modules/partida/dto/equipe-partida.dto';
import { PartidaRespostaDto } from 'src/modules/partida/dto/partida.dto';
import { PartidaService } from 'src/modules/partida/services/partida.service';
import { TipoRodadaMataMata } from 'src/modules/partida/types/tipo-rodada.type';
import { PontuacaoRespostaDto } from 'src/modules/pontuacao/dtos/pontuacao.dto';
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
  ) {
    super();
  }

  private listarVencedores(partidas: PartidaRespostaDto[]) {
    return chunk(
      partidas,
      MataMataGeneratorService.quantidadeDePartidasPorConfronto,
    ).map((confronto, index) => {
      const grupoVencedores = countBy(
        confronto,
        (partida) => partida.idEquipeGanhador,
      );

      const vencedor = Object.entries(grupoVencedores).find(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, quantidadePartidas]) => quantidadePartidas > 1,
      );

      if (!vencedor?.[0] || vencedor[0] === 'undefined') {
        const [partida] = confronto;
        throw new ConflictException(
          `Confronto ${index + 1} entre ${partida.idEquipeMandante} x ${
            partida.idEquipeVisitante
          } não foi definido um vencedor ainda`,
        );
      }

      return vencedor[0];
    });
  }

  // Caso a colocação do vencedor da chave a direita seja maior,
  // invertemos a posição com a outra equipe para manter a escolha de mando
  // consistente com as regras
  private ordenaVencedorPorClassificacao(
    vencedores: string[],
    pontuacoes: PontuacaoRespostaDto[],
  ) {
    const idEquipeClassificacaoMap: ReadonlyMap<string, number> = new Map(
      pontuacoes.map((pontuacao, index) => [pontuacao.equipe.id, index + 1]),
    );

    const resultado = [...vencedores];

    resultado.some((vencedorEsquerda, index, array) => {
      const direitaIndex = array.length - index - 1;
      const vencedorDireita = vencedorEsquerda[direitaIndex];

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
        `Não foram agendadas ${rodadaAnterior.quantidadePartidasAgendadas} partidas para as quartas de final da liga ${idLiga}`,
      );
    }

    const pontuacoes = await this.pontuacaoService.listaPontuacoesOrdenadas(
      idLiga,
      Liga.quantidadeDeEquipesClassificadas,
    );

    const vencedores = this.listarVencedores(partidas);

    const vencedoresOrdenadosPorClassificacao =
      this.ordenaVencedorPorClassificacao(vencedores, pontuacoes);

    const equipeMap: ReadonlyMap<string, EquipeSimplificadaRespostaDto> =
      new Map(
        partidas
          .filter((partida) => partida.ganhadora)
          .map(({ ganhadora }) => {
            const equipePartida = ganhadora as EquipePartidaRespostaDto;

            return [equipePartida.equipe.id, equipePartida.equipe];
          }),
      );

    return {
      equipes: vencedoresOrdenadosPorClassificacao.map(
        (vencedor) => equipeMap.get(vencedor) as EquipeRespostaDto,
      ),
    };
  }
}
