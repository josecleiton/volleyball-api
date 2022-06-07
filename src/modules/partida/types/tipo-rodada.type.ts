/** Utility function to create a K:V from a list of strings */
function strEnum<T extends string>(o: Array<T>): { [K in T]: K } {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}

export const tiposDeRodada = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  'quartas',
  'semis',
  'final',
] as const;
const TipoRodadaKV = strEnum([...tiposDeRodada]);

export type TipoRodada = keyof typeof TipoRodadaKV;
export type TipoRodadaMataMata = Extract<
  TipoRodada,
  'quartas' | 'semis' | 'final'
>;
