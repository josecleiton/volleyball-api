import { CriaPessoaDto } from '../dto';
import { Pessoa } from '../entities';
import { TipoPessoa } from '../enums';

export function dtoParaPessoa(dto: CriaPessoaDto, tipo: TipoPessoa): Pessoa {
  const pessoa = new Pessoa(tipo);
  pessoa.nome = dto.nome;
  pessoa.documento = dto.documento;
  pessoa.genero = dto.genero;
  pessoa.dataNascimento = dto.dataNascimento;
  pessoa.documentoCbv = dto.documentoCbv;

  return pessoa;
}
