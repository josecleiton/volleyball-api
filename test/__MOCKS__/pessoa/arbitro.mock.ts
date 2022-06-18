import {
  CriaArbitroDto,
  ListaArbitroDto,
} from 'src/modules/pessoa/dto/arbitro.dto';
import { criaPessoaDto } from './pessoa.mock';

export function criaArbitroDto(idLiga: string) {
  return Object.assign(new CriaArbitroDto(), { ...criaPessoaDto(), idLiga });
}

export function listaArbitroDto(idLiga: string) {
  return Object.assign(new ListaArbitroDto(), { idLiga });
}
