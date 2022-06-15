import { Genero } from 'src/modules/core/enums';
import { CriaLigaDto, InicializaLigaDto } from 'src/modules/liga/dto/liga.dto';
import faker = require('faker');
import { DiaDaSemana } from 'src/modules/core/enums/dia-da-semana.enum';
import { startOfYear } from 'date-fns';

export function criaLigaDto(
  genero = Genero.feminino,
  serie = 'A',
): CriaLigaDto {
  return Object.assign(new CriaLigaDto(), {
    genero,
    nome: faker.commerce.department(),
    serie,
  });
}

interface IInicializaLigaDto {
  data?: Date;
  diasDaSemana?: DiaDaSemana[];
  horarios?: number[];
  intervaloDeDiasUteisEntreTurnos?: number;
}

export function inicializaLigaDto({
  data,
  diasDaSemana,
  horarios,
  intervaloDeDiasUteisEntreTurnos,
}: IInicializaLigaDto): InicializaLigaDto {
  return Object.assign(new InicializaLigaDto(), {
    data: data ?? faker.date.between(startOfYear(new Date()), new Date()),
    diasDaSemana: diasDaSemana ?? [
      DiaDaSemana.Sexta,
      DiaDaSemana.Sábado,
      DiaDaSemana.Domingo,
    ],
    horarios: horarios ?? [600, 660],
    intervaloDeDiasUteisEntreTurnos:
      intervaloDeDiasUteisEntreTurnos ??
      faker.datatype.number({ min: 2, max: 5 }),
  });
}
