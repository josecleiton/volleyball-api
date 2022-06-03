import { Partida } from 'src/modules/partida/entities/partida.entity';
import { IClassificados } from '../dto/mata-mata.dto';
import { EscolhaDeMando, IMataMataDto } from '../dto/tabela.dto';

export abstract class MataMataGeneratorService {
  private static readonly escolhaDeMando: ReadonlyMap<EscolhaDeMando, number> =
    new Map([
      [EscolhaDeMando.PRIMEIRO_JOGO, 0],
      [EscolhaDeMando.SEGUNDO_JOGO, 1],
    ]);

  protected abstract readonly tipoRodada: 'quartas' | 'semis';
  protected abstract listaClassificados(
    idLiga: string,
  ): Promise<IClassificados>;

  async geraPartidas({ datas, mandos, idLiga }: IMataMataDto) {
    const classificados = await this.listaClassificados(idLiga);

    const partidasAgendadas: Partida[] = [];

    classificados.equipes.some((melhorColocado, index, { length }) => {
      const piorColocado = classificados.equipes[length - index - 1];

      const mandoVariavel = MataMataGeneratorService.escolhaDeMando.get(
        mandos[index],
      ) as 0 | 1;
      const mandoDaIdaIndex: ReadonlySet<number> = new Set([mandoVariavel, 2]);

      partidasAgendadas.push(
        ...datas.map((data) => {
          const partida = new Partida();

          partida.dataComeco = data;

          if (mandoDaIdaIndex.has(index)) {
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

      return index === length / 2;
    });

    return partidasAgendadas;
  }
}
