import { Column } from 'typeorm';
import { TemPessoa } from './tem_pessoa.entity';

export abstract class PessoaDeEquipe extends TemPessoa {
  @Column('uuid')
  idEquipe!: string;
}
