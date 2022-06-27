import faker = require('faker');
import {
  AtualizaAtletaDto,
  CriaAtletaDto,
  ListaAtletaDto,
} from 'src/modules/pessoa/dto/atleta.dto';
import { criaPessoaDto } from './pessoa.mock';

export function criaAtletaDto(
  idEquipe: string,
  numero?: number,
): CriaAtletaDto {
  return Object.assign(new CriaAtletaDto(), {
    ...criaPessoaDto(),
    idEquipe,
    numero: numero ?? faker.datatype.number({ min: 1, max: 50 }),
  });
}

export function listaAtletasDto(idEquipe: string): ListaAtletaDto {
  return Object.assign(new ListaAtletaDto(), { idEquipe });
}

export function atualizaAtletaDto(numeroAntigo: number) {
  return Object.assign(new AtualizaAtletaDto(), {
    numero: faker.datatype.number({ min: numeroAntigo + 1, max: 100 }),
  });
}
