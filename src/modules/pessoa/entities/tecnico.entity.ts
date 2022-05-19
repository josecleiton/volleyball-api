import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PessoaDeEquipe } from './pessoa_de_equipe';

@Entity('tecnicos')
export class Tecnico extends PessoaDeEquipe {
  @Column({ unique: true, type: 'varchar', length: 50 })
  documentoCref!: string; // documento do conselho de educação fisica

  @ManyToOne(() => Equipe, (equipe) => equipe.atletas)
  @JoinColumn({ name: 'id_equipe' })
  equipe!: Equipe;
}
