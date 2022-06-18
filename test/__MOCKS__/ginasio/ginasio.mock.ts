import {
  CriaGinasioDto,
  ListaGinasiosDto,
} from 'src/modules/ginasio/dto/ginasio.dto';
import faker = require('faker');

export function criaGinasioDto(
  nome?: string,
  cidade?: string,
  estado?: string,
  capacidade = 1000,
): CriaGinasioDto {
  return Object.assign(new CriaGinasioDto(), {
    nome: nome ?? faker.name.title(),
    cidade: cidade ?? faker.address.city(),
    estado: estado ?? faker.address.stateAbbr(),
    capacidade,
  });
}

export function listaGinasiosDto(
  nome?: string,
  cidade?: string,
  estado?: string,
): ListaGinasiosDto {
  return Object.assign(new ListaGinasiosDto(), {
    nome,
    cidade,
    estado,
  });
}
