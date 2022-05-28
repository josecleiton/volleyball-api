import { Injectable, Scope } from '@nestjs/common';
import { nextDay, setMinutes } from 'date-fns';
import { DiaDaSemana } from 'src/modules/core/enums/dia-da-semana.enum';
import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { Partida } from 'src/modules/partida/entities/partida.entity';
import { DoublyLinkedList } from 'datastructures-js';

interface IClassificacaoGeneratorRequest {
  equipes: Equipe[];
  dataComeco: Date;
  diasDaSemana: DiaDaSemana[];
  ordemReversa: boolean;
  horarios: number[];
}

@Injectable({ scope: Scope.TRANSIENT })
export class ClassificacaoGeneratorService {
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

  private *proximaData(
    dataComeco: Date,
    diasDaSemana: Day[],
    horarios: number[],
  ) {
    const listaHorarios = new DoublyLinkedList<number>();
    horarios.forEach((element) => listaHorarios.insertLast(element));

    const listaDiasDaSemanaIndices = new DoublyLinkedList<Day>();
    diasDaSemana.forEach((x) => listaDiasDaSemanaIndices.insertLast(x));

    let horarioAtual = listaHorarios.head();
    let diaDaSemanaAtual = listaDiasDaSemanaIndices.head();
    let dataAtual = dataComeco;

    while (true) {
      if (!diasDaSemana.some((day) => day === dataAtual.getDay())) {
        dataAtual = nextDay(dataAtual, diaDaSemanaAtual.getValue());
      }
      dataAtual = setMinutes(dataAtual, horarioAtual.getValue());
      if (listaHorarios.tail() === horarioAtual) {
        horarioAtual = listaHorarios.head();
        diaDaSemanaAtual = diaDaSemanaAtual.getNext();
      } else {
        horarioAtual = horarioAtual.getNext();
      }

      yield dataAtual;
    }
  }

  geraPartidas({
    equipes,
    ordemReversa,
    dataComeco,
    diasDaSemana,
    horarios,
  }: IClassificacaoGeneratorRequest): Partida[] {
    const resultado: Partida[] = [];
    const agendadorPartida = this.proximaData(
      dataComeco,
      diasDaSemana
        .map(
          (x) =>
            ClassificacaoGeneratorService.diaDaSemanaIndiceMap.get(x) as Day,
        )
        .sort(),
      horarios.sort(),
    );
    for (let i = 0; i < equipes.length; i++) {
      for (let j = i + 1; j < equipes.length; j++) {
        const equipeMandante = ordemReversa ? equipes[j] : equipes[i];
        const equipeVisitante = ordemReversa ? equipes[i] : equipes[j];

        const partida = new Partida();

        partida.equipeMandante = equipeMandante;
        partida.idGinasio = partida.equipeMandante.idGinasio;
        partida.equipeVisitante = equipeVisitante;

        const resultadoAgendador = agendadorPartida.next();
        partida.dataComeco = resultadoAgendador.value as Date;

        resultado.push(partida);
      }
    }

    agendadorPartida.return();

    return resultado;
  }
}
