import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { TipoAuxiliar } from '../enums';
import { PessoaDeEquipe } from './pessoa_de_equipe';

@Entity('auxiliares')
export class Auxiliar extends PessoaDeEquipe {
  @Column({ type: 'enum', enum: TipoAuxiliar })
  @Index()
  tipoAuxiliar!: TipoAuxiliar;

  @Column({ unique: true, type: 'varchar', length: 50 })
  documentoCref!: string; // documento do conselho de educação fisica

  @ManyToOne(() => Equipe, (equipe) => equipe.auxiliares)
  @JoinColumn({ name: 'id_equipe' })
  equipe!: Equipe;
}