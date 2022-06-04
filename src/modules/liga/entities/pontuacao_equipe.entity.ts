import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('pontuacoes_equipe')
export class PontuacaoEquipe extends EntidadeBase {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'int', default: 0 })
  @Index()
  pontuacao!: number;

  @OneToOne(() => Equipe)
  @JoinColumn({ name: 'id' })
  equipe!: Equipe;
}
