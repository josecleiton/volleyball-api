import cpf = require('cpf');
import faker = require('faker');

import {
  CriaAuxiliarDto,
  ListaAuxiliarDto,
} from 'src/modules/pessoa/dto/auxiliar.dto';
import { TipoAuxiliar } from 'src/modules/pessoa/enums';
import { criaPessoaDto } from './pessoa.mock';

export function criaAuxiliarDto(
  idEquipe: string,
  tipo?: TipoAuxiliar,
  documentoCref?: string,
) {
  return Object.assign(new CriaAuxiliarDto(), {
    ...criaPessoaDto(),
    idEquipe,
    tipoAuxiliar: tipo ?? faker.random.objectElement(TipoAuxiliar),
    documentoCref: documentoCref ?? cpf.generate(false),
  });
}

export function listaAuxiliarDto(idEquipe: string) {
  return Object.assign(new ListaAuxiliarDto(), { idEquipe });
}
