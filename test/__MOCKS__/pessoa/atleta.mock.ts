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
    numero: numero ?? faker.datatype.number({ min: 0, max: 100 }),
  });
}

export function listaAtletasDto(idEquipe: string): ListaAtletaDto {
  return Object.assign(new ListaAtletaDto(), { idEquipe });
}

export function atualizaAtletaDto(numero = false) {
  return Object.assign(new AtualizaAtletaDto(), {
    numero: numero ? faker.datatype.number({ min: 0, max: 100 }) : undefined,
  });
}
