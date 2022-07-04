import { addDays } from 'date-fns';
import faker = require('faker');
import {
  InicializaFinalDto,
  InicializaQuartaDeFinalDto,
  InicializaSemifinalDto,
} from 'src/modules/liga/dto/tabela.dto';
import { EscolhaDeMando } from 'src/modules/liga/enums';

export function inicializaQuartaDeFinalDto(
  dataUltimaPartida: Date,
): InicializaQuartaDeFinalDto {
  const dataBase = faker.date.recent(2, dataUltimaPartida);
  const datas = [...Array(12).keys()].map((index) => addDays(dataBase, index));
  const mandos = Array<EscolhaDeMando>(4).fill(EscolhaDeMando.PRIMEIRO_JOGO);

  return Object.assign(new InicializaQuartaDeFinalDto(), {
    datas,
    mandos,
  });
}

export function inicializaSemiFinalDto(
  dataUltimaPartida: Date,
): InicializaSemifinalDto {
  const dataBase = faker.date.recent(2, dataUltimaPartida);
  const datas = [...Array(6).keys()].map((index) => addDays(dataBase, index));
  const mandos = Array<EscolhaDeMando>(2).fill(EscolhaDeMando.PRIMEIRO_JOGO);

  return Object.assign(new InicializaSemifinalDto(), {
    datas,
    mandos,
  });
}

export function inicializaFinalDto(dataUltimaPartida: Date) {
  const dataBase = faker.date.recent(2, dataUltimaPartida);
  const datas = [...Array(3).keys()].map((index) => addDays(dataBase, index));

  return Object.assign(new InicializaFinalDto(), {
    datas,
    mando: EscolhaDeMando.PRIMEIRO_JOGO,
  });
}
