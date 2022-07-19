import { chunk } from 'lodash';
import {
  PartidaFactory,
  TipoRodadaMataMata,
  Partida,
} from 'src/modules/partida';
import { IClassificados, IMataMataDto } from '../dto';
import { EscolhaDeMando } from '../enums';

export abstract class MataMataGeneratorService {
  constructor(private readonly partidaFactory: PartidaFactory) {}
  private static readonly escolhaDeMando: ReadonlyMap<EscolhaDeMando, number> =
    new Map([
      [EscolhaDeMando.PRIMEIRO_JOGO, 0],
      [EscolhaDeMando.SEGUNDO_JOGO, 1],
    ]);
  private static readonly mandoFixoIndice = 2;
  static readonly quantidadesDePartidasParaVencerConfronto = 2;
  static readonly quantidadeDePartidasPorConfronto = 3;
  static readonly quantidadeDePartidasNasQuartas = 12;
  static readonly quantidadeDePartidasNasSemis =
    this.quantidadeDePartidasNasQuartas / 2;
  static readonly quantidadeDePartidasNaFinal =
    this.quantidadeDePartidasNasSemis / 2;

  protected abstract readonly tipoRodada: TipoRodadaMataMata;
  protected abstract listaClassificados(
    idLiga: string,
  ): Promise<IClassificados>;

  async geraPartidas({ datas, mandos, idLiga }: IMataMataDto) {
    const classificados = await this.listaClassificados(idLiga);

    const datasPorConfronto = chunk(
      datas,
      MataMataGeneratorService.quantidadeDePartidasPorConfronto,
    );

    const partidasAgendadas: Partida[] = [];

    classificados.equipes.some(
      (melhorColocado, classificadoIndex, { length }) => {
        const piorColocado =
          classificados.equipes[length - classificadoIndex - 1];

        const mandoVariavel = MataMataGeneratorService.escolhaDeMando.get(
          mandos[classificadoIndex],
        ) as 0 | 1;
        const mandoDaIdaIndiceSet: ReadonlySet<number> = new Set([
          mandoVariavel,
          MataMataGeneratorService.mandoFixoIndice,
        ]);

        const partidasDoConfronto = datasPorConfronto[classificadoIndex].map(
          (data, dataIndex) => {
            const mandoEhDoMelhorColocado = mandoDaIdaIndiceSet.has(dataIndex);
            return this.partidaFactory.instanciaPartida({
              dataComeco: data,
              tipoDaRodada: this.tipoRodada,
              equipeMandante: mandoEhDoMelhorColocado
                ? melhorColocado
                : piorColocado,
              equipeVisitante: mandoEhDoMelhorColocado
                ? piorColocado
                : melhorColocado,
            });
          },
        );

        partidasAgendadas.push(...partidasDoConfronto);

        return classificadoIndex === length / 2 - 1;
      },
    );

    return partidasAgendadas;
  }
}
