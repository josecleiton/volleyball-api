import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { PessoaDeEquipe } from './pessoa_de_equipe';

@Entity('tecnicos')
export class Tecnico extends PessoaDeEquipe {
  @Column({ unique: true, type: 'varchar', length: 50 })
  documentoCref!: string; // documento do conselho de educação fisica

  @OneToOne(() => Equipe, (equipe) => equipe.tecnico)
  @JoinColumn({ name: 'id_equipe' })
  equipe!: Equipe;
}