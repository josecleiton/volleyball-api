import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Pessoa } from './pessoa.entity';

@Entity()
export class Tecnico extends EntidadeBase {
  @Column({ unique: true, type: 'varchar', length: 50 })
  documentoCref!: string; // documento do conselho de educação fisica

  @Column({ type: 'uuid' })
  idEquipe!: string;

  @OneToOne(() => Pessoa)
  @JoinColumn({ name: 'id_pessoa' })
  pessoa!: Pessoa;

  @OneToOne(() => Equipe)
  @JoinColumn({ name: 'id_equipe' })
  equipe!: Equipe;
}
