import { Equipe } from 'src/modules/equipe';
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { PessoaDeEquipe } from './pessoa_de_equipe.entity';

@Entity('tecnicos')
export class Tecnico extends PessoaDeEquipe {
  @Column({ unique: true, type: 'varchar', length: 50 })
  documentoCref!: string; // documento do conselho de educação fisica

  @OneToOne('Equipe', 'tecnico', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_equipe' })
  equipe!: Equipe;
}
