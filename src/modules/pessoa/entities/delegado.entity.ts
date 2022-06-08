import { Liga } from 'src/modules/liga/entities/liga.entity';
import { Partida } from 'src/modules/partida/entities/partida.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { TemPessoa } from './tem_pessoa.entity';

@Entity('delegados')
export class Delegado extends TemPessoa {
  @OneToMany(() => Partida, (p) => p.delegado)
  partidas!: Partida[];

  @Column('uuid')
  @Index()
  idLiga!: string;

  @OneToOne(() => Liga)
  @JoinColumn({ name: 'id_liga' })
  liga!: Liga;
}
