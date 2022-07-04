import { addDays } from 'date-fns';
import faker = require('faker');
import { InicializaQuartaDeFinalDto } from 'src/modules/liga/dto/tabela.dto';
import { EscolhaDeMando } from 'src/modules/liga/enums';

export function inicializaQuartaDeFinalDto(
  dataUltimaPartida: Date,
): InicializaQuartaDeFinalDto {
  const dataBase = faker.date.recent(2, dataUltimaPartida);
  const datas = [...Array(12).keys()].map((index) => addDays(dataBase, index));
  const mandos = Array(4).fill(EscolhaDeMando.PRIMEIRO_JOGO);

  return Object.assign(new InicializaQuartaDeFinalDto(), {
    datas,
    mandos,
  });
}
