import { DiaDaSemana } from 'src/modules/core/enums/dia-da-semana.enum';

const diaDaSemanaIndiceMap: ReadonlyMap<DiaDaSemana, Day> = new Map([
  [DiaDaSemana.Domingo, 0],
  [DiaDaSemana.Segunda, 1],
  [DiaDaSemana.Terça, 2],
  [DiaDaSemana.Quarta, 3],
  [DiaDaSemana.Quinta, 4],
  [DiaDaSemana.Sexta, 5],
  [DiaDaSemana.Sábado, 6],
]);

export { diaDaSemanaIndiceMap };
