import { Liga } from 'src/modules/liga/entities/liga.entity';
import { Column, Index, JoinColumn, ManyToOne } from 'typeorm';
import { TemPessoa } from './tem_pessoa.entity';

export abstract class PessoaDeLiga extends TemPessoa {
  @Column('uuid')
  @Index()
  idLiga!: string;

  @ManyToOne('Liga', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_liga' })
  liga!: Liga;
}
