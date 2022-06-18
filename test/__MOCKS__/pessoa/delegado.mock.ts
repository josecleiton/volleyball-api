import {
  CriaDelegadoDto,
  ListaDelegadoDto,
} from 'src/modules/pessoa/dto/delegado.dto';
import { criaPessoaDto } from './pessoa.mock';

export function criaDelegadoDto(idLiga: string) {
  return Object.assign(new CriaDelegadoDto(), { ...criaPessoaDto(), idLiga });
}

export function listaDelegadoDto(idLiga: string) {
  return Object.assign(new ListaDelegadoDto(), { idLiga });
}
