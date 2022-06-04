import { chunk } from 'lodash';
import { Partida } from 'src/modules/partida/entities/partida.entity';
import { IClassificados } from '../dto/mata-mata.dto';
import { EscolhaDeMando, IMataMataDto } from '../dto/tabela.dto';

export abstract class MataMataGeneratorService {
  private static readonly escolhaDeMando: ReadonlyMap<EscolhaDeMando, number> =
    new Map([
      [EscolhaDeMando.PRIMEIRO_JOGO, 0],
      [EscolhaDeMando.SEGUNDO_JOGO, 1],
    ]);
  private static readonly mandoFixoIndice = 2;

  protected abstract readonly tipoRodada: 'quartas' | 'semis';
  protected abstract listaClassificados(
    idLiga: string,
  ): Promise<IClassificados>;

  async geraPartidas({ datas, mandos, idLiga }: IMataMataDto) {
    const classificados = await this.listaClassificados(idLiga);

    const chunksData = chunk(datas, 3) as [Date[], Date[], Date[], Date[]];

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

        partidasAgendadas.push(
          ...chunksData[classificadoIndex].map((data, dataIndex) => {
            const partida = new Partida();

            partida.dataComeco = data;

            if (mandoDaIdaIndiceSet.has(dataIndex)) {
              partida.idMandante = melhorColocado.id;
              partida.idGinasio = melhorColocado.idGinasio;
              partida.idVisitante = piorColocado.id;
            } else {
              partida.idMandante = piorColocado.id;
              partida.idGinasio = piorColocado.idGinasio;
              partida.idVisitante = melhorColocado.id;
            }

            partida.tipoDaRodada = this.tipoRodada;

            return partida;
          }),
        );

        return classificadoIndex === length / 2 - 1;
      },
    );

    return partidasAgendadas;
  }
}
