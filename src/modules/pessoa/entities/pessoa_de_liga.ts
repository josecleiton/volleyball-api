import { Liga } from 'src/modules/competicao/entities/liga.entity';
import { Column, Index, JoinColumn, OneToOne } from 'typeorm';
import { TemPessoa } from './tem_pessoa.entity';

export abstract class PessoaDeLiga extends TemPessoa {
  @Column('uuid')
  @Index()
  idLiga!: string;

  @OneToOne(() => Liga)
  @JoinColumn({ name: 'id_liga' })
  liga!: Liga;
}
