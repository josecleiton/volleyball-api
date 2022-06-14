import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { AtletaEscalado } from 'src/modules/partida/entities/atleta-escalado.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { PessoaDeEquipe } from './pessoa_de_equipe.entity';

@Entity('atletas')
@Unique('UQ_atletas_numero_por_equipe', ['numero', 'idEquipe'])
export class Atleta extends PessoaDeEquipe {
  @Column({ type: 'smallint' })
  numero!: number;

  @ManyToOne(() => Equipe, (equipe) => equipe.atletas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_equipe' })
  equipe!: Equipe;

  @OneToMany(() => AtletaEscalado, (ap) => ap.atleta)
  atletas!: AtletaEscalado[];
}
