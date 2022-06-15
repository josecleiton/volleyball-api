import cpf = require('cpf');
import { CriaTecnicoDto } from 'src/modules/pessoa/dto/tecnico.dto';
import { criaPessoaDto } from './pessoa.mock';

export function criaTecnicoDto(
  idEquipe: string,
  documentoCref?: string,
): CriaTecnicoDto {
  return Object.assign(new CriaTecnicoDto(), {
    ...criaPessoaDto(),
    idEquipe,
    documentoCref: documentoCref ?? cpf.generate(false),
  });
}
