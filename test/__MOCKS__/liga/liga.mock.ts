import { Genero } from 'src/modules/core/enums';
import { CriaLigaDto } from 'src/modules/liga/dto/liga.dto';
import * as faker from 'faker';

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
