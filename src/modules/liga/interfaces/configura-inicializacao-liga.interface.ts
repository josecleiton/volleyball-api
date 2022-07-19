import { DiaDaSemana } from 'src/modules/core';

export interface IConfiguraInicializaoLiga {
  horarios: number[];
  diasDaSemana: DiaDaSemana[];
  intervaloDeDiasUteisEntreTurnos: number;
}
