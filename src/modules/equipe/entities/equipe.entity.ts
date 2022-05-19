import { Liga } from 'src/modules/competicao/entities/liga.entity';
import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Atleta } from 'src/modules/pessoa/entities/atleta.entity';
import { Tecnico } from 'src/modules/pessoa/entities/tecnico.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity('equipes')
export class Equipe extends EntidadeBase {
  @Column({ type: 'varchar', length: 255, unique: true })
  nome!: string;

  @Column({ nullable: true })
  urlBrasao?: string;

  @Column({ type: 'boolean', default: false })
  apta = false;

  @Column({ type: 'jsonb', nullable: true })
  descricaoAptidao?: unknown;

  @Column('uuid')
  idLiga!: string;

  @OneToOne(() => Tecnico, (t) => t.equipe)
  tecnico!: Tecnico;

  @OneToMany(() => Atleta, (a) => a.equipe)
  atletas!: Atleta[];

  @ManyToOne(() => Liga, (c) => c.equipe)
  @JoinColumn({ name: 'id_liga' })
  liga!: Liga;
}
