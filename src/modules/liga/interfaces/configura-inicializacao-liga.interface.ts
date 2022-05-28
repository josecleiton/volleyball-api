import { DiaDaSemana } from 'src/modules/core/enums/dia-da-semana.enum';

export interface IConfiguraInicializaoLiga {
  horarios: number[];
  diasDaSemana: DiaDaSemana[];
}
