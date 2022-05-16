import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Pessoa } from './pessoa.entity';

@Entity()
export class Tecnico extends EntidadeBase {
  @Column({ unique: true, type: 'varchar', length: 50 })
  documentoCref!: string; // documento do conselho de educação fisica

  @Column()
  idEquipe!: string;

  @OneToOne(() => Pessoa)
  @JoinColumn()
  pessoa!: Pessoa;
}
