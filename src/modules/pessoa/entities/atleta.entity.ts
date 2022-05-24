import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Posicao } from '../enums';
import { PessoaDeEquipe } from './pessoa_de_equipe';

@Entity('atletas')
@Unique('UQ_atletas_numero_por_equipe', ['numero', 'idEquipe'])
export class Atleta extends PessoaDeEquipe {
  @Column({ type: 'enum', enum: Posicao })
  posicao!: Posicao;

  @Column({ type: 'smallint' })
  numero!: number;

  @ManyToOne(() => Equipe, (equipe) => equipe.atletas)
  @JoinColumn({ name: 'id_equipe' })
  equipe!: Equipe;
}
