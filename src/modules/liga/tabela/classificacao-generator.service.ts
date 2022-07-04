import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { addBusinessDays, nextDay, setMinutes } from 'date-fns';
import { DiaDaSemana } from 'src/modules/core/enums/dia-da-semana.enum';
import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { Partida } from 'src/modules/partida/entities/partida.entity';
import { DoublyLinkedList } from 'datastructures-js';
import { createGroup } from 'tournament_creator';
import { TipoRodada } from 'src/modules/partida/types/tipo-rodada.type';
import { PartidaFactory } from 'src/modules/partida/factories/partida.factory';

interface IClassificacaoGeneratorRequest {
  equipes: Equipe[];
  dataComeco: Date;
  diasDaSemana: DiaDaSemana[];
  horarios: number[];
  intervaloDeDiasUteisEntreTurnos: number;
}

@Injectable()
export class ClassificacaoGeneratorService {
  constructor(private readonly partidaFactory: PartidaFactory) {}
  private static readonly diaDaSemanaIndiceMap: ReadonlyMap<DiaDaSemana, Day> =
    new Map([
      [DiaDaSemana.Domingo, 0],
      [DiaDaSemana.Segunda, 1],
      [DiaDaSemana.Terça, 2],
      [DiaDaSemana.Quarta, 3],
      [DiaDaSemana.Quinta, 4],
      [DiaDaSemana.Sexta, 5],
      [DiaDaSemana.Sábado, 6],
    ]);

  private geraDatas(
    quantidadeEquipes: number,
    dataComeco: Date,
    diasDaSemana: Day[],
    horarios: number[],
  ) {
    const listaHorarios = DoublyLinkedList.fromArray(horarios);
    const listaDiasDaSemanaIndices = DoublyLinkedList.fromArray(diasDaSemana);

    let horarioAtual = listaHorarios.head();
    let diaDaSemanaAtual = listaDiasDaSemanaIndices.head();
    let dataAtual = dataComeco;

    const datas: Date[] = [];
    const max = (quantidadeEquipes * (quantidadeEquipes - 1)) / 2;
    for (let index = 0; index < max; index++) {
      if (!diasDaSemana.some((day) => day === dataAtual.getDay())) {
        dataAtual = nextDay(dataAtual, diaDaSemanaAtual.getValue());
      }
      dataAtual = setMinutes(dataAtual, horarioAtual.getValue());
      if (listaHorarios.tail() === horarioAtual) {
        horarioAtual = listaHorarios.head();

        diaDaSemanaAtual =
          diaDaSemanaAtual === listaDiasDaSemanaIndices.tail()
            ? listaDiasDaSemanaIndices.head()
            : diaDaSemanaAtual.getNext();
      } else {
        horarioAtual = horarioAtual.getNext();
      }

      datas.push(dataAtual);
    }

    return datas;
  }

  geraPartidas({
    equipes,
    dataComeco,
    diasDaSemana,
    horarios,
    intervaloDeDiasUteisEntreTurnos,
  }: IClassificacaoGeneratorRequest): Partida[] {
    if (equipes.length & 1) {
      throw new UnprocessableEntityException('Quantidade de equipe é ímpar');
    }

    if (diasDaSemana.length * horarios.length !== equipes.length / 2) {
      throw new UnprocessableEntityException(
        'Não é possível agendar um jogo por semana (rodada) para cada equipe. O produto entre o tamanho da lista de dias da semana e horarios tem que ser igual a metade do número de equipes',
      );
    }

    const diasDaSemanaIndices = diasDaSemana
      .map(
        (x) => ClassificacaoGeneratorService.diaDaSemanaIndiceMap.get(x) as Day,
      )
      .sort();
    const horariosOrdenados = horarios.sort();
    const datasPrimeiroTurno = this.geraDatas(
      equipes.length,
      dataComeco,
      diasDaSemanaIndices,
      horariosOrdenados,
    );
    const datasSegundoTurno = this.geraDatas(
      equipes.length,
      addBusinessDays(
        datasPrimeiroTurno[datasPrimeiroTurno.length - 1],
        intervaloDeDiasUteisEntreTurnos,
      ),
      diasDaSemanaIndices,
      horariosOrdenados,
    );

    const datasDasPartidas = [...datasPrimeiroTurno, ...datasSegundoTurno];
    const idEquipeMap: ReadonlyMap<string, Equipe> = new Map(
      equipes.map((equipe) => [equipe.id, equipe]),
    );

    return createGroup({
      name: 'voleibol',
      teams: equipes.map((x) => x.id),
      rematch: true,
    }).matches.map((match, index) => {
      return this.partidaFactory.instanciaPartida({
        dataComeco: datasDasPartidas[index],
        equipeMandante: idEquipeMap.get(match.homeTeam as string) as Equipe,
        equipeVisitante: idEquipeMap.get(match.awayTeam as string) as Equipe,
        tipoDaRodada: match.roundNumber?.toString() as TipoRodada,
      });
    });
  }
}
