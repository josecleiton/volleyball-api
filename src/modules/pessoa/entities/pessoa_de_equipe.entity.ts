import { Column, Index } from 'typeorm';
import { TemPessoa } from './tem_pessoa.entity';

export abstract class PessoaDeEquipe extends TemPessoa {
  @Column('uuid')
  @Index()
  idEquipe!: string;
}
