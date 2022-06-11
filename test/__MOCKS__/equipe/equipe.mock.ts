import {
  AtualizaEquipeDto,
  CriaEquipeDto,
  ListaEquipesDto,
} from 'src/modules/equipe/dto/equipe.dto';
import faker = require('faker');

export function criaEquipeDto(
  idLiga?: string,
  idGinasio?: string,
  nome?: string,
  cidade?: string,
  estado?: string,
): CriaEquipeDto {
  return Object.assign(new CriaEquipeDto(), {
    idLiga,
    idGinasio,
    nome: nome ?? faker.company.companyName(),
    cidade: cidade ?? faker.address.city(),
    estado: estado ?? faker.address.stateAbbr(),
  });
}

export function listaEquipesDto(idLiga: string): ListaEquipesDto {
  return Object.assign(new ListaEquipesDto(), {
    idLiga,
  });
}

export function atualizaEquipeDto(
  idGinasio?: string,
  nome = false,
  cidade = false,
  estado = false,
): AtualizaEquipeDto {
  return Object.assign(new AtualizaEquipeDto(), {
    idGinasio,
    nome: nome ? faker.name.title() : undefined,
    cidade: cidade ? faker.address.city() : undefined,
    estado: estado ? faker.address.state() : undefined,
  });
}
