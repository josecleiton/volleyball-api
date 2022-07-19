import { Equipe } from 'src/modules/equipe';
import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { TipoAuxiliar } from '../enums';
import { PessoaDeEquipe } from './pessoa_de_equipe.entity';

@Entity('auxiliares')
export class Auxiliar extends PessoaDeEquipe {
  @Column({ type: 'enum', enum: TipoAuxiliar })
  @Index()
  tipoAuxiliar!: TipoAuxiliar;

  @Column({ unique: true, type: 'varchar', length: 50 })
  documentoCref!: string; // documento do conselho de educação fisica

  @ManyToOne('Equipe', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_equipe' })
  equipe!: Equipe;
}
