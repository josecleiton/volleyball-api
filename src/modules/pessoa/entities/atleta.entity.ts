import { Equipe } from 'src/modules/equipe';
import { AtletaEscalado } from 'src/modules/partida';
import {
  Entity,
  Unique,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { PessoaDeEquipe } from './pessoa_de_equipe.entity';

@Entity('atletas')
@Unique('UQ_atletas_numero_por_equipe', ['numero', 'idEquipe'])
export class Atleta extends PessoaDeEquipe {
  @Column({ type: 'smallint' })
  numero!: number;

  @ManyToOne('Equipe', {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_equipe' })
  equipe!: Equipe;

  @OneToMany('AtletaEscalado', 'atleta')
  atletas!: AtletaEscalado[];
}
