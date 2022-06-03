import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Tabela extends EntidadeBase {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'int', default: 0 })
  pontuacao!: number;

  @OneToOne(() => Equipe)
  @JoinColumn({ name: 'id' })
  equipe!: Equipe;
}
