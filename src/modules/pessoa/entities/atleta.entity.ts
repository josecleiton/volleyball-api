import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { AtletaPartida } from 'src/modules/partida/entities/atleta-partida.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { PessoaDeEquipe } from './pessoa_de_equipe';

@Entity('atletas')
@Unique('UQ_atletas_numero_por_equipe', ['numero', 'idEquipe'])
export class Atleta extends PessoaDeEquipe {
  @Column({ type: 'smallint' })
  numero!: number;

  @ManyToOne(() => Equipe, (equipe) => equipe.atletas)
  @JoinColumn({ name: 'id_equipe' })
  equipe!: Equipe;

  @OneToMany(() => AtletaPartida, (ap) => ap.atleta)
  atletas!: AtletaPartida[];
}
