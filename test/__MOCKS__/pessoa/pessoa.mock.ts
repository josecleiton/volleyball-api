import faker = require('faker');
import cpf = require('cpf');
import { Genero } from 'src/modules/core/enums';
import { CriaPessoaDto } from 'src/modules/pessoa/dto/pessoa.dto';
import { subYears } from 'date-fns';

export function criaPessoaDto(
  nome?: string,
  documento?: string,
  genero = Genero.feminino,
  dataNascimento?: Date,
  documentoCbv?: string,
): CriaPessoaDto {
  return Object.assign(new CriaPessoaDto(), {
    nome: nome ?? faker.name.findName(),
    documento: documento ?? cpf.generate(false),
    genero,
    dataNascimento:
      dataNascimento ??
      faker.date.between(subYears(new Date(), 38), subYears(new Date(), 17)),
    documentoCbv: documentoCbv ?? cpf.generate(false),
  });
}
